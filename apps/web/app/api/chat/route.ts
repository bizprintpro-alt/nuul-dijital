import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const response = getAIResponse(message);

  return NextResponse.json({ response });
}

function getAIResponse(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes("домэйн")) {
    return "Домэйн бүртгүүлэхийн тулд Домэйн захиалах хэсэг рүү орно уу. .mn домэйн ₮165,000, .com домэйн ₮62,500-аас эхэлнэ. Хайлт хийж, боломжтой домэйнаа шалгаарай!";
  }
  if (msg.includes("хостинг") || msg.includes("сервер")) {
    return "Бид 3 хостинг план санал болгодог:\n• Starter — ₮99,000/сар (1 домэйн, 5GB)\n• Business — ₮249,000/сар (5 домэйн, 25GB, AI чатбот)\n• Enterprise — Тохиролцоно\n\nХостинг хэсэг рүү орж дэлгэрэнгүй харна уу.";
  }
  if (msg.includes("төлбөр") || msg.includes("qpay") || msg.includes("socialpay")) {
    return "Бид QPay болон SocialPay-ээр төлбөр хүлээн авдаг. Нэхэмжлэх & Төлбөр хэсэгт орж QPay QR код үүсгэж төлбөрөө хийгээрэй. Төлбөр 1-2 минутын дотор баталгаажна.";
  }
  if (msg.includes("чатбот") || msg.includes("ai")) {
    return "AI Чатбот Builder ашиглан Facebook, вэбсайт, Viber дээр монгол хэлтэй чатбот үүсгэж болно. 94% хүртэл хариултыг автоматаар хариулдаг. AI Чатбот Builder хэсэг рүү орно уу.";
  }
  if (msg.includes("crm") || msg.includes("борлуулалт")) {
    return "CRM & Борлуулалт хэсэгт Kanban board ашиглан борлуулалтын pipeline удирдаж болно. Lead нэмэх, stage өөрчлөх, утасны дугаар, имэйл хадгалах боломжтой.";
  }
  if (msg.includes("ssl") || msg.includes("сертификат")) {
    return "SSL сертификат бүх хостинг планд үнэгүй багтдаг. Let's Encrypt SSL автоматаар суулгагдаж, шинэчлэгддэг. Хэрэв асуудал гарвал тикет үүсгэнэ үү.";
  }
  if (msg.includes("dns")) {
    return "DNS тохиргоог домэйн удирдлагын хэсгээс хийж болно. A, CNAME, MX, TXT record нэмэх боломжтой. Өөрчлөлт 24-48 цагийн дотор идэвхжинэ.";
  }

  return "Баярлалаа! Таны асуултыг хүлээн авлаа. Дэлгэрэнгүй тусламж авахыг хүсвэл доорх сэдвүүдийн аль нэгийг сонгоно уу:\n\n• Домэйн бүртгэл\n• Хостинг үйлчилгээ\n• Төлбөр & QPay\n• AI Чатбот\n• CRM борлуулалт\n• SSL сертификат\n• DNS тохиргоо\n\nЭсвэл тикет үүсгэж манай багтай холбогдоно уу.";
}
