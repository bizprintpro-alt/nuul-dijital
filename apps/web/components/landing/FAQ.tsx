"use client";

import { useState } from "react";

const faqItems = [
  {
    q: "Домэйн бүртгүүлэхэд хэр удаан шаардлагатай вэ?",
    a: "Домэйн хайлтаас эхлээд бүртгэл хүртэл 5 минутаас хэтрэхгүй. QPay эсвэл SocialPay-ээр төлбөрөө хийсний дараа домэйн шууд идэвхжинэ.",
  },
  {
    q: "Хостинг үйлчилгээ ямар серверт ажилладаг вэ?",
    a: "Бид AWS болон Cloudflare-ийн дэд бүтцийг ашигладаг. 99.9% uptime-ийн баталгаатай бөгөөд Монголоос хурдан холбогдох CDN ашиглана.",
  },
  {
    q: "AI чатбот хэрхэн ажилладаг вэ?",
    a: "Монгол хэлний NLP модель ашигласан AI чатбот нь Facebook Messenger, вэбсайт, Viber дээр зэрэг ажиллах боломжтой. Таны бизнесийн мэдээллээр сургагдсан тусгай бот үүсгэнэ.",
  },
  {
    q: "Төлбөрөө яаж хийх вэ?",
    a: "QPay, SocialPay, дансаар шилжүүлэг, VISA/Mastercard зэрэг бүх төлбөрийн хэлбэрийг дэмждэг. Автомат сунгалтын тохиргоо хийх боломжтой.",
  },
  {
    q: "Багц дундаа солих боломжтой юу?",
    a: "Тийм. Хэдийд ч дээд багц руу шилжих боломжтой бөгөөд үлдсэн хугацааны зөрүү төлбөрийг тооцож шилжүүлнэ. Доод багц руу шилжих бол дараагийн төлбөрийн хугацаанаас эхлэн өөрчлөгдөнө.",
  },
  {
    q: "Техникийн дэмжлэг хэрхэн авах вэ?",
    a: "Starter багц 9-18 цагт имэйл дэмжлэгтэй. Business болон Enterprise багц 24/7 AI дэмжлэг, чат, утасны дуудлагын дэмжлэгтэй. Дундаж хариу хугацаа 4 секунд.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {faqItems.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-white/[0.04] bg-bg-2 transition-colors hover:border-white/[0.08]"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-[14px] font-medium leading-snug text-txt">
                {item.q}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                className={`flex-shrink-0 text-txt-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-[13px] leading-relaxed text-txt-2">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
