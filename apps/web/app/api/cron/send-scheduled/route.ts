import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCampaign } from "@/lib/email-marketing";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const scheduledCampaigns = await prisma.emailCampaign.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: { lte: new Date() },
      },
    });

    let sent = 0;

    for (const campaign of scheduledCampaigns) {
      try {
        await sendCampaign(campaign.id);
        sent++;
      } catch (err) {
        console.error(
          `[cron/send-scheduled] Кампанит "${campaign.name}" илгээхэд алдаа:`,
          err
        );
      }
    }

    return NextResponse.json({ sent });
  } catch (error) {
    console.error("[cron/send-scheduled] Алдаа:", error);
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
