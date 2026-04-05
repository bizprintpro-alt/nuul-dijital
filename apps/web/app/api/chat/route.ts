import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getChatResponse } from "@/lib/openai-chat";

/* ─── In-memory rate limiter: 20 messages/hour per IP ─── */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// Periodically clean up stale entries (every 10 minutes)
if (typeof globalThis !== "undefined") {
  const cleanup = () => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  };
  setInterval(cleanup, 10 * 60 * 1000);
}

/* ─── POST /api/chat ─── */
export async function POST(req: NextRequest) {
  try {
    // Rate limit check
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          response:
            "Хэт олон мессеж илгээлээ. 1 цагийн дараа дахин оролдоно уу. Эсвэл тикет үүсгэж манай багтай холбогдоорой.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { message, history } = body as {
      message: string;
      history?: { role: string; content: string }[];
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { response: "Мессеж оруулна уу." },
        { status: 400 }
      );
    }

    // Build conversation messages
    const conversationMessages: { role: string; content: string }[] = [];

    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        // Keep last 10 messages for context
        if (msg.role && msg.content) {
          conversationMessages.push({
            role: msg.role === "ai" ? "assistant" : msg.role,
            content: msg.content,
          });
        }
      }
    }

    conversationMessages.push({ role: "user", content: message.trim() });

    // Get AI response
    const response = await getChatResponse(conversationMessages);

    // Save to DB if user is authenticated
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        await prisma.chatMessage.createMany({
          data: [
            {
              userId: session.user.id,
              role: "user",
              content: message.trim(),
            },
            {
              userId: session.user.id,
              role: "assistant",
              content: response,
            },
          ],
        });
      }
    } catch (dbError) {
      // Don't fail the request if DB save fails
      console.error("Failed to save chat messages to DB:", dbError);
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        response:
          "Уучлаарай, алдаа гарлаа. Дахин оролдоно уу эсвэл тикет үүсгэнэ үү.",
      },
      { status: 500 }
    );
  }
}
