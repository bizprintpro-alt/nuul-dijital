import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ===================== USERS =====================
  const adminPassword = await bcrypt.hash("Admin1234!", 12);
  const testPassword = await bcrypt.hash("Test1234!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@nuul.mn" },
    update: {},
    create: {
      email: "admin@nuul.mn",
      name: "Админ",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("  ✅ Admin user:", admin.email);

  const batbayar = await prisma.user.upsert({
    where: { email: "batbayar@test.mn" },
    update: {},
    create: {
      email: "batbayar@test.mn",
      name: "Батбаяр Д.",
      password: testPassword,
      role: "CLIENT",
      emailVerified: new Date(),
    },
  });

  const nomin = await prisma.user.upsert({
    where: { email: "nomin@test.mn" },
    update: {},
    create: {
      email: "nomin@test.mn",
      name: "Номин Г.",
      password: testPassword,
      role: "CLIENT",
      emailVerified: new Date(),
    },
  });

  const enkhbayar = await prisma.user.upsert({
    where: { email: "enkhbayar@test.mn" },
    update: {},
    create: {
      email: "enkhbayar@test.mn",
      name: "Энхбаяр С.",
      password: testPassword,
      role: "CLIENT",
      emailVerified: new Date(),
    },
  });
  console.log("  ✅ Test clients:", batbayar.email, nomin.email, enkhbayar.email);

  // ===================== HOSTING PLANS =====================
  const starterPlan = await prisma.hostingPlan.upsert({
    where: { slug: "starter" },
    update: {},
    create: {
      name: "Starter",
      slug: "starter",
      type: "STARTER",
      description: "Жижиг бизнест тохиромжтой",
      price: 99000,
      priceYearly: 990000,
      storage: 5,
      bandwidth: 50,
      websites: 1,
      emails: 5,
      features: [
        "1 домэйн + хост",
        "Бэлэн загварт вэбсайт",
        "SSL + 5 имэйл",
        "Дэмжлэг 9–18 цаг",
      ],
      isActive: true,
    },
  });

  const businessPlan = await prisma.hostingPlan.upsert({
    where: { slug: "business" },
    update: {},
    create: {
      name: "Business",
      slug: "business",
      type: "BUSINESS",
      description: "Дунд болон том бизнест",
      price: 249000,
      priceYearly: 2490000,
      storage: 25,
      bandwidth: 0,
      websites: 5,
      emails: 25,
      features: [
        "5 домэйн + cloud хост",
        "CRM + имэйл маркетинг",
        "AI чатбот",
        "QPay / SocialPay",
        "AI дэмжлэг 24/7",
      ],
      isActive: true,
    },
  });

  const enterprisePlan = await prisma.hostingPlan.upsert({
    where: { slug: "enterprise" },
    update: {},
    create: {
      name: "Enterprise",
      slug: "enterprise",
      type: "ENTERPRISE",
      description: "Томоохон байгууллагад зориулсан",
      price: 0,
      storage: 100,
      bandwidth: 0,
      websites: 999,
      emails: 999,
      features: [
        "Хязгааргүй домэйн",
        "ERP / Odoo",
        "Call center + Callpro",
        "Dedicated manager",
      ],
      isActive: true,
    },
  });
  console.log("  ✅ Hosting plans: starter, business, enterprise");

  // ===================== DOMAINS =====================
  const now = new Date();

  const domainMiniishop = await prisma.domain.upsert({
    where: { name: "miniishop.mn" },
    update: {},
    create: {
      name: "miniishop.mn",
      tld: ".mn",
      userId: batbayar.id,
      status: "ACTIVE",
      price: 165000,
      expiresAt: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
    },
  });

  const domainCompany = await prisma.domain.upsert({
    where: { name: "company.com" },
    update: {},
    create: {
      name: "company.com",
      tld: ".com",
      userId: batbayar.id,
      status: "ACTIVE",
      price: 62500,
      expiresAt: new Date(now.getFullYear(), now.getMonth() + 8, now.getDate()),
    },
  });

  const domainBlog = await prisma.domain.upsert({
    where: { name: "blog.org" },
    update: {},
    create: {
      name: "blog.org",
      tld: ".org",
      userId: nomin.id,
      status: "PENDING",
      price: 75000,
    },
  });
  console.log("  ✅ Domains: miniishop.mn, company.com, blog.org");

  // ===================== SUBSCRIPTIONS =====================
  const subBatbayar = await prisma.subscription.create({
    data: {
      userId: batbayar.id,
      planId: businessPlan.id,
      status: "ACTIVE",
      startAt: now,
      endAt: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
    },
  });

  const subNomin = await prisma.subscription.create({
    data: {
      userId: nomin.id,
      planId: starterPlan.id,
      status: "ACTIVE",
      startAt: now,
      endAt: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
    },
  });
  console.log("  ✅ Subscriptions: batbayar (Business), nomin (Starter)");

  // ===================== ORDERS =====================

  // Order 1: Domain order for miniishop.mn (PAID)
  const orderDomain1 = await prisma.order.create({
    data: {
      userId: batbayar.id,
      domainId: domainMiniishop.id,
      type: "DOMAIN",
      amount: 165000,
      status: "PAID",
    },
  });

  // Order 2: Domain order for company.com (PAID)
  const orderDomain2 = await prisma.order.create({
    data: {
      userId: batbayar.id,
      domainId: domainCompany.id,
      type: "DOMAIN",
      amount: 62500,
      status: "PAID",
    },
  });

  // Order 3: Domain order for blog.org (PAID)
  const orderDomain3 = await prisma.order.create({
    data: {
      userId: nomin.id,
      domainId: domainBlog.id,
      type: "DOMAIN",
      amount: 75000,
      status: "PAID",
    },
  });

  // Order 4: Hosting order for batbayar subscription (PAID)
  const orderHosting1 = await prisma.order.create({
    data: {
      userId: batbayar.id,
      subscriptionId: subBatbayar.id,
      type: "HOSTING",
      amount: 2490000,
      status: "PAID",
    },
  });

  // Order 5: Hosting order for nomin subscription (PAID)
  const orderHosting2 = await prisma.order.create({
    data: {
      userId: nomin.id,
      subscriptionId: subNomin.id,
      type: "HOSTING",
      amount: 990000,
      status: "PAID",
    },
  });

  // Order 6: Pending order for enkhbayar
  const orderPending = await prisma.order.create({
    data: {
      userId: enkhbayar.id,
      type: "DOMAIN_AND_HOSTING",
      amount: 348000,
      status: "PENDING",
    },
  });
  console.log("  ✅ Orders: 6 created (5 paid, 1 pending)");

  // ===================== PAYMENTS =====================
  const paidOrders = [
    { order: orderDomain1, method: "QPAY" as const, txId: "QPAY-TXN-100001" },
    { order: orderDomain2, method: "SOCIALPAY" as const, txId: "SP-TXN-200002" },
    { order: orderDomain3, method: "QPAY" as const, txId: "QPAY-TXN-100003" },
    { order: orderHosting1, method: "QPAY" as const, txId: "QPAY-TXN-100004" },
    { order: orderHosting2, method: "SOCIALPAY" as const, txId: "SP-TXN-200005" },
  ];

  for (const p of paidOrders) {
    await prisma.payment.create({
      data: {
        orderId: p.order.id,
        method: p.method,
        transactionId: p.txId,
        amount: p.order.amount,
        status: "COMPLETED",
        paidAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log("  ✅ Payments: 5 completed");

  // ===================== CRM LEADS =====================
  const leads = [
    { name: "Голомт Банк", company: "Голомт Банк", stage: "NEW" as const, value: 5000000 },
    { name: "СГС Групп", company: "СГС Групп", stage: "CONTACTED" as const, value: 8500000 },
    { name: "Монос Групп", company: "Монос Групп", stage: "PROPOSAL" as const, value: 3200000 },
    { name: "Тэнгэр ХХК", company: "Тэнгэр ХХК", stage: "CLOSED_WON" as const, value: 4100000 },
  ];

  for (const lead of leads) {
    await prisma.cRMLead.create({
      data: {
        userId: batbayar.id,
        name: lead.name,
        company: lead.company,
        stage: lead.stage,
        value: lead.value,
      },
    });
  }
  console.log("  ✅ CRM Leads: 4 created for batbayar");

  // ===================== TICKETS =====================
  const tickets = [
    {
      userId: batbayar.id,
      subject: "SSL сертификат шинэчлэх",
      message: "Манай miniishop.mn домэйний SSL сертификат дуусах гэж байна. Шинэчлэхэд тусална уу?",
      status: "RESOLVED" as const,
      priority: "HIGH" as const,
      aiResolved: true,
    },
    {
      userId: batbayar.id,
      subject: "DNS тохиргоо тусламж",
      message: "company.com домэйний DNS тохиргоог өөрчлөх хэрэгтэй байна. A record нэмж өгнө үү?",
      status: "IN_PROGRESS" as const,
      priority: "MEDIUM" as const,
      aiResolved: false,
    },
    {
      userId: nomin.id,
      subject: "QPay интеграц асуулт",
      message: "QPay интеграцыг хэрхэн хийх талаар зөвлөгөө өгнө үү?",
      status: "RESOLVED" as const,
      priority: "MEDIUM" as const,
      aiResolved: true,
    },
  ];

  for (const ticket of tickets) {
    await prisma.ticket.create({ data: ticket });
  }
  console.log("  ✅ Tickets: 3 created");

  // ===================== CHATBOTS =====================
  await prisma.chatBot.create({
    data: {
      userId: batbayar.id,
      name: "Борлуулалтын бот",
      platform: "FACEBOOK",
      flowJson: JSON.stringify({
        nodes: [
          { id: "start", type: "trigger", data: { label: "Эхлэх" } },
          { id: "greet", type: "message", data: { text: "Сайн байна уу! Бид танд хэрхэн туслах вэ?" } },
          { id: "menu", type: "menu", data: { options: ["Бүтээгдэхүүн", "Үнэ", "Холбоо барих"] } },
        ],
        edges: [
          { source: "start", target: "greet" },
          { source: "greet", target: "menu" },
        ],
      }),
      isActive: true,
    },
  });

  await prisma.chatBot.create({
    data: {
      userId: batbayar.id,
      name: "Вэбсайт тусламж",
      platform: "WEB",
      flowJson: JSON.stringify({
        nodes: [
          { id: "start", type: "trigger", data: { label: "Эхлэх" } },
          { id: "greet", type: "message", data: { text: "Тавтай морилно уу! Асуултаа бичнэ үү." } },
          { id: "ai", type: "ai_response", data: { model: "gpt-4", prompt: "Answer user question" } },
        ],
        edges: [
          { source: "start", target: "greet" },
          { source: "greet", target: "ai" },
        ],
      }),
      isActive: true,
    },
  });
  console.log("  ✅ ChatBots: 2 created for batbayar");

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
