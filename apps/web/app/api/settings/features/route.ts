import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { startsWith: "feature_" } },
    });

    const features = Object.fromEntries(
      settings.map((s) => [s.key, s.value])
    );

    return NextResponse.json({ features });
  } catch {
    return NextResponse.json({ features: {} });
  }
}
