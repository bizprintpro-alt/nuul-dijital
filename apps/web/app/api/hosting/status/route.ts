import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServer } from "@/lib/hetzner";

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
    const { accountId } = body as { accountId?: string };

    if (!accountId) {
      return NextResponse.json(
        { error: "accountId шаардлагатай" },
        { status: 400 },
      );
    }

    const account = await prisma.hostingAccount.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Хостинг данс олдсонгүй" },
        { status: 404 },
      );
    }

    // If already active or deleted, just return current status
    if (account.status !== "PROVISIONING") {
      return NextResponse.json({
        status: account.status,
        ip: account.serverIp,
      });
    }

    // Check Hetzner server status
    const server = await getServer(account.serverId);

    if (server.status === "running" && server.ip) {
      // Update to ACTIVE
      const updated = await prisma.hostingAccount.update({
        where: { id: accountId },
        data: {
          status: "ACTIVE",
          serverIp: server.ip,
        },
      });

      return NextResponse.json({
        status: updated.status,
        ip: updated.serverIp,
      });
    }

    return NextResponse.json({
      status: account.status,
      ip: account.serverIp,
    });
  } catch (error) {
    console.error("[HOSTING_STATUS]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Статус шалгахад алдаа гарлаа",
      },
      { status: 500 },
    );
  }
}
