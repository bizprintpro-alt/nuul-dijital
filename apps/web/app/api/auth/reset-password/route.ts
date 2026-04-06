import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Токен болон нууц үг шаардлагатай" },
        { status: 400 },
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой" },
        { status: 400 },
      );
    }

    // Find valid (non-expired) token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Линк хүчингүй болсон. Дахин нууц үг сэргээх хүсэлт илгээнэ үү." },
        { status: 400 },
      );
    }

    // Hash new password and update user
    const hashedPassword = await hash(password, 12);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // Delete the used token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { error: "Серверийн алдаа. Дахин оролдоно уу." },
      { status: 500 },
    );
  }
}
