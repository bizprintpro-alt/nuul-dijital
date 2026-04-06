import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const items = await prisma.navItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true, label: true, labelEn: true, href: true, openInNew: true },
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
