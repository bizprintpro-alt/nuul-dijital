import { NextRequest, NextResponse } from "next/server";

const domainPricing: Record<string, number> = {
  ".mn": 165000, ".com": 62500, ".org": 75000, ".net": 94600, ".shop": 88000,
};

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const base = query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/\.[^.]+$/, "");

  // TODO: Integrate real WHOIS API for .mn domains
  const results = Object.entries(domainPricing).map(([tld, price]) => ({
    domain: `${base}${tld}`,
    tld,
    price,
    available: Math.random() > 0.35,
  }));

  return NextResponse.json({ results });
}
