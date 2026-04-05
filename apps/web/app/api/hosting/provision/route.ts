import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createServer, HETZNER_PLANS, type PlanKey } from "@/lib/hetzner";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Нэвтрэх шаардлагатай" },
        { status: 401 },
      );
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const { planType } = body as { planType?: string };

    if (!planType || !["STARTER", "BUSINESS", "ENTERPRISE"].includes(planType)) {
      return NextResponse.json(
        { error: "planType буруу байна (STARTER | BUSINESS | ENTERPRISE)" },
        { status: 400 },
      );
    }

    const plan = planType as PlanKey;
    const serverName = `nuul-${plan.toLowerCase()}-${userId.slice(0, 8)}-${Date.now()}`;

    // Create server on Hetzner
    const server = await createServer({
      name: serverName,
      serverType: plan,
      userId,
      planId: plan,
    });

    // Create hosting account record
    const account = await prisma.hostingAccount.create({
      data: {
        userId,
        serverId: server.id,
        serverIp: server.ip,
        status: "PROVISIONING",
        planType: plan,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return NextResponse.json({
      accountId: account.id,
      serverId: server.id,
      status: "provisioning",
    });
  } catch (error) {
    console.error("[HOSTING_PROVISION]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Сервер үүсгэхэд алдаа гарлаа",
      },
      { status: 500 },
    );
  }
}
