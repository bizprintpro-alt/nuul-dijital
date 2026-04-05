export const siteConfig = {
  name: "Nuul.mn",
  description: "Дижитал шийдэл - Домэйн, Хостинг, Вэбсайт",
  url: "https://nuul.mn",
  currency: "MNT",
  locale: "mn-MN",
} as const;

export const domainPricing = {
  ".mn": { register: 25000, renew: 25000 },
  ".com.mn": { register: 15000, renew: 15000 },
  ".org.mn": { register: 15000, renew: 15000 },
  ".com": { register: 35000, renew: 35000 },
  ".org": { register: 40000, renew: 40000 },
  ".net": { register: 38000, renew: 38000 },
} as const;

export type DomainTLD = keyof typeof domainPricing;
