import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1x1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(req: NextRequest) {
  const campaignId = req.nextUrl.searchParams.get("cid");

  if (campaignId) {
    try {
      await prisma.emailCampaign.update({
        where: { id: campaignId },
        data: { opened: { increment: 1 } },
      });
    } catch (err) {
      console.error("[email-track/open] Алдаа:", err);
    }
  }

  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}
