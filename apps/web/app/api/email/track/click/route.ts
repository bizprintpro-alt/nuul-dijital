import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const campaignId = req.nextUrl.searchParams.get("cid");

  if (campaignId) {
    try {
      await prisma.emailCampaign.update({
        where: { id: campaignId },
        data: { clicked: { increment: 1 } },
      });
    } catch (err) {
      console.error("[email-track/click] Алдаа:", err);
    }
  }

  if (!url) {
    return NextResponse.json(
      { error: "URL олдсонгүй" },
      { status: 400 }
    );
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    return NextResponse.redirect(decodedUrl);
  } catch {
    return NextResponse.json(
      { error: "Буруу URL формат" },
      { status: 400 }
    );
  }
}
