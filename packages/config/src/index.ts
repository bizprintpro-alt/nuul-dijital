export const siteConfig = {
  name: "Nuul.mn",
  description: "Таны дижитал үүл — Домэйн, Хостинг, AI, CRM бүгдийг нэг дороос",
  url: "https://nuul.mn",
  currency: "MNT",
  locale: "mn-MN",
} as const;

export const domainPricing = {
  ".mn": { register: 165000, renew: 165000 },
  ".com": { register: 62500, renew: 62500 },
  ".org": { register: 75000, renew: 75000 },
  ".net": { register: 94600, renew: 94600 },
  ".shop": { register: 88000, renew: 88000 },
} as const;

export type DomainTLD = keyof typeof domainPricing;

export const hostingPlans = [
  {
    name: "Starter",
    slug: "starter",
    type: "STARTER" as const,
    price: 99000,
    priceYearly: 990000,
    storage: 5,
    bandwidth: 50,
    websites: 1,
    emails: 5,
    features: ["1 домэйн + хост", "Бэлэн загварт вэбсайт", "SSL + 5 имэйл хаяг", "Дэмжлэг 9–18 цаг"],
  },
  {
    name: "Business",
    slug: "business",
    type: "BUSINESS" as const,
    price: 249000,
    priceYearly: 2490000,
    storage: 25,
    bandwidth: 0,
    websites: 5,
    emails: 25,
    features: [
      "5 домэйн + cloud хост",
      "CRM + имэйл маркетинг",
      "AI чатбот Facebook + вэб",
      "QPay / SocialPay",
      "AI дэмжлэг 24/7",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    type: "ENTERPRISE" as const,
    price: 0,
    priceYearly: 0,
    storage: 100,
    bandwidth: 0,
    websites: -1,
    emails: -1,
    features: [
      "Хязгааргүй домэйн & хост",
      "ERP / Odoo нэвтрүүлэлт",
      "Call center + Callpro",
      "Dedicated manager",
    ],
    custom: true,
  },
] as const;

export const sidebarNav = [
  {
    group: "ҮНДСЭН",
    items: [
      { label: "Хянах самбар", href: "/dashboard", icon: "LayoutDashboard" },
    ],
  },
  {
    group: "ДОМЭЙН & ХОСТ",
    items: [
      { label: "Домэйн захиалах", href: "/dashboard/domains", icon: "Globe" },
      { label: "Хостинг", href: "/dashboard/hosting", icon: "Server", badge: "Шинэ" },
      { label: "VPS/Cloud", href: "/dashboard/vps", icon: "Cloud" },
    ],
  },
  {
    group: "БИЗНЕСИЙН ХЭРЭГСЭЛ",
    items: [
      { label: "Вэбсайт Builder", href: "/dashboard/website-builder", icon: "PanelsTopLeft" },
      { label: "eSeller дэлгүүр", href: "/dashboard/eseller", icon: "ShoppingCart", badge: "4" },
      { label: "И-мэйл маркетинг", href: "/dashboard/email-marketing", icon: "Mail" },
    ],
  },
  {
    group: "AI ҮЙЛЧИЛГЭЭ",
    items: [
      { label: "AI Чатбот Builder", href: "/dashboard/chatbot", icon: "Bot", badge: "AI" },
      { label: "CRM & Борлуулалт", href: "/dashboard/crm", icon: "Users" },
      { label: "Call Center 24/7", href: "/dashboard/call-center", icon: "Phone" },
    ],
  },
  {
    group: "ТАЙЛАН",
    items: [
      { label: "Аналитик", href: "/dashboard/analytics", icon: "BarChart3" },
      { label: "Нэхэмжлэх & Төлбөр", href: "/dashboard/invoices", icon: "Receipt", badge: undefined },
      { label: "AI Дэмжлэг", href: "/dashboard/support", icon: "Headphones", badge: "8" },
    ],
  },
] as const;
