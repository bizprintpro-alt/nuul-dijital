import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Зөвшөөрөлгүй" }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл байхгүй" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "JPG, PNG, WEBP, GIF л зөвшөөрнө" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Файлын хэмжээ 8MB-с бага байх ёстой" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}
