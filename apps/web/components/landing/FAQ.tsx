"use client";

import { useState } from "react";

const faqItems = [
  {
    q: "Яагаад агентлаг сонгох ёстой вэ?",
    a: "Өөрөө маркетингчин, дизайнер, хөгжүүлэгч ажиллуулахын оронд туршлагатай багтай гэрээгээр ажиллахад цаг, өртөг хэмнэлттэй. Бид 10+ мэргэжилтэнтэй багаар таны бизнест яг хэрэгтэй үйлчилгээг хүргэнэ.",
  },
  {
    q: "Ямар хугацаанд үр дүн гарах вэ?",
    a: "FB реклам 1-2 долоо хоногт анхны үр дүн үзүүлнэ. Вэбсайт 2-4 долоо хоногт бэлэн болно. Тогтвортой маркетингийн үр дүн 2-3 сарын дараа харагдаж эхэлнэ.",
  },
  {
    q: "AI чатбот хэрхэн ажилладаг вэ?",
    a: "Монгол хэлний NLP модель ашигласан AI чатбот нь Facebook Messenger, вэбсайт, Viber дээр зэрэг ажиллах боломжтой. Таны бизнесийн мэдээллээр сургагдсан тусгай бот үүсгэнэ.",
  },
  {
    q: "Төлбөрийг хэрхэн хийх вэ?",
    a: "QPay, SocialPay, дансаар шилжүүлэг хэлбэрээр төлбөрөө хийж болно. Ихэнх үйлчилгээ сар бүрийн гэрээтэй, үргэлжлэх хугацаа уян хатан.",
  },
  {
    q: "Багц дундаа солих боломжтой юу?",
    a: "Тийм. Хэдийд ч багцаа өөрчилж болно. Шинэ дээд багц руу шилжихэд үлдсэн хугацааны зөрүүг тооцно.",
  },
  {
    q: "Домэйн & хостинг тусгайлан авах уу?",
    a: "Тийм, үйлчилгээний хэсэгчлэн авч болно. Зөвхөн домэйн/хост хэрэглэнэ гэвэл self-serve portal ашиглаж бие даан захиалах боломжтой.",
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
