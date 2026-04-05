import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ─── GET /api/chatbot — list user's chatbots ─── */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ chatbots: [] }, { status: 401 });
    }

    const chatbots = await prisma.chatBot.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ chatbots });
  } catch (error) {
    console.error("GET /api/chatbot error:", error);
    return NextResponse.json(
      { error: "Чатботуудыг ачаалж чадсангүй" },
      { status: 500 }
    );
  }
}

/* ─── POST /api/chatbot — create a new chatbot ─── */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Нэвтэрнэ үү" }, { status: 401 });
    }

    const { name, platform, flowJson } = await req.json();

    if (!name || !platform) {
      return NextResponse.json(
        { error: "Нэр болон платформ шаардлагатай" },
        { status: 400 }
      );
    }

    const validPlatforms = ["FACEBOOK", "WEB", "VIBER", "TELEGRAM"];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: "Буруу платформ" },
        { status: 400 }
      );
    }

    const chatbot = await prisma.chatBot.create({
      data: {
        userId: session.user.id,
        name,
        platform,
        flowJson: flowJson || "{}",
        isActive: false,
      },
    });

    return NextResponse.json({ chatbot }, { status: 201 });
  } catch (error) {
    console.error("POST /api/chatbot error:", error);
    return NextResponse.json(
      { error: "Чатбот үүсгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}

/* ─── PATCH /api/chatbot — toggle active status ─── */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Нэвтэрнэ үү" }, { status: 401 });
    }

    const { id, isActive } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID шаардлагатай" }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.chatBot.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
    }

    const chatbot = await prisma.chatBot.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
    });

    return NextResponse.json({ chatbot });
  } catch (error) {
    console.error("PATCH /api/chatbot error:", error);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}

/* ─── DELETE /api/chatbot — delete a chatbot ─── */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Нэвтэрнэ үү" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID шаардлагатай" }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.chatBot.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
    }

    await prisma.chatBot.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/chatbot error:", error);
    return NextResponse.json({ error: "Устгахад алдаа гарлаа" }, { status: 500 });
  }
}
