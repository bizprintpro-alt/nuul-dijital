import { router } from "@/lib/trpc";
import { domainRouter } from "./domain";
import { orderRouter } from "./order";
import { paymentRouter } from "./payment";
import { userRouter } from "./user";
import { analyticsRouter } from "./analytics";
import { crmRouter } from "./crm";
import { ticketRouter } from "./ticket";
import { adminRouter } from "./admin";

export const appRouter = router({
  domain: domainRouter,
  order: orderRouter,
  payment: paymentRouter,
  user: userRouter,
  analytics: analyticsRouter,
  crm: crmRouter,
  ticket: ticketRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
