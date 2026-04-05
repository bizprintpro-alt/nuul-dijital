import { NextRequest, NextResponse } from "next/server";
import { checkDomainAvailability, checkRateLimit } from "@/lib/domain-checker";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Хамгийн багадаа 2 тэмдэгт оруулна уу" }, { status: 400 });
  }

  // Rate limit
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Хэт олон хүсэлт. 1 минут хүлээнэ үү" }, { status: 429 });
  }

  // Validate: only alphanumeric + hyphens
  const clean = query.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/\.[^.]+$/, "");
  if (!clean || !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(clean)) {
    return NextResponse.json({ error: "Зөвхөн латин үсэг, тоо, зураас ашиглана уу" }, { status: 400 });
  }

  try {
    const results = await checkDomainAvailability(clean);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("[DOMAIN_SEARCH]", error);
    return NextResponse.json({ error: "Домэйн шалгахад алдаа гарлаа" }, { status: 500 });
  }
}
