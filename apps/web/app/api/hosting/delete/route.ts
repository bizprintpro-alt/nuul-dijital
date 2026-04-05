import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteServer } from "@/lib/hetzner";

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

    // Find and verify ownership
    const account = await prisma.hostingAccount.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Хостинг данс олдсонгүй" },
        { status: 404 },
      );
    }

    if (account.status === "DELETED") {
      return NextResponse.json(
        { error: "Аль хэдийн устгагдсан" },
        { status: 400 },
      );
    }

    // Delete server on Hetzner
    await deleteServer(account.serverId);

    // Update DB status
    await prisma.hostingAccount.update({
      where: { id: accountId },
      data: { status: "DELETED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[HOSTING_DELETE]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Сервер устгахад алдаа гарлаа",
      },
      { status: 500 },
    );
  }
}
