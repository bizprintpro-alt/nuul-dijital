import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Нэрээ оруулна уу")
    .max(100, "Нэр хэт урт байна"),
  email: z
    .string()
    .email("Имэйл хаяг буруу байна")
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string()
    .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой")
    .max(128, "Нууц үг хэт урт байна"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Буруу өгөгдөл";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Энэ имэйл хаягаар бүртгэл үүссэн байна" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT",
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    await sendWelcomeEmail(name, email).catch(() => {});

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Серверийн алдаа. Дахин оролдоно уу.", debug: message },
      { status: 500 },
    );
  }
}
