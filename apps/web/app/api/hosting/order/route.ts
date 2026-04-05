import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HETZNER_PLANS, type PlanKey } from "@/lib/hetzner";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Нэвтрэх шаардлагатай" },
        { status: 401 },
      );
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const { planType } = body as { planType?: string };

    if (!planType || !["STARTER", "BUSINESS", "ENTERPRISE"].includes(planType)) {
      return NextResponse.json(
        { error: "planType буруу байна" },
        { status: 400 },
      );
    }

    const plan = HETZNER_PLANS[planType as PlanKey];

    const order = await prisma.order.create({
      data: {
        userId,
        type: "HOSTING",
        amount: plan.price,
        status: "PENDING",
      },
    });

    return NextResponse.json({ id: order.id, amount: order.amount });
  } catch (error) {
    console.error("[HOSTING_ORDER]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Захиалга үүсгэхэд алдаа гарлаа",
      },
      { status: 500 },
    );
  }
}
