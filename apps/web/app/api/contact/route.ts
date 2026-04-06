import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Нэр, имэйл, мессеж заавал шаардлагатай" },
        { status: 400 }
      );
    }

    // Find or create a "contact" service category and service to link the quote
    let category = await prisma.serviceCategory.findFirst({
      where: { slug: "contact" },
    });

    if (!category) {
      category = await prisma.serviceCategory.create({
        data: {
          name: "Холбоо барих",
          slug: "contact",
          description: "Холбоо барих хүсэлтүүд",
        },
      });
    }

    let service = await prisma.service.findFirst({
      where: { categoryId: category.id, name: "Холбоо барих" },
    });

    if (!service) {
      service = await prisma.service.create({
        data: {
          name: "Холбоо барих",
          description: "Холбоо барих хүсэлтүүд",
          categoryId: category.id,
        },
      });
    }

    // Save as ServiceQuote with projectType="contact"
    await prisma.serviceQuote.create({
      data: {
        serviceId: service.id,
        name,
        email,
        phone: phone || "",
        projectType: "contact",
        description: `[${subject || "Бусад"}] ${message}`,
      },
    });

    // Send notification email to admin (console.log fallback)
    console.log(
      `[Contact Form] New message from ${name} (${email}): ${subject} - ${message}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа" },
      { status: 500 }
    );
  }
}
