import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In the future, query the database for domains expiring soon
    const warningWindows = [30, 14, 7]; // days before expiry
    let checked = 0;
    let warned = 0;

    for (const days of warningWindows) {
      // TODO: Replace with actual DB query
      // const expiringDomains = await prisma.domain.findMany({
      //   where: {
      //     expiresAt: {
      //       gte: new Date(),
      //       lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      //     },
      //     expiryWarned: { not: days },
      //   },
      // });

      const expiringDomains: { name: string; expiresAt: Date }[] = [];
      checked += expiringDomains.length;

      for (const domain of expiringDomains) {
        console.log(
          `[domain-expiry] Domain "${domain.name}" expires in ${days} days (${domain.expiresAt.toISOString()})`
        );
        warned++;
        // TODO: Send email notification
        // await sendExpiryEmail(domain, days);
      }
    }

    return NextResponse.json({ checked, warned });
  } catch (error) {
    console.error("[domain-expiry] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
