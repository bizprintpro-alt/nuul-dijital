import { router } from "@/lib/trpc";
import { domainRouter } from "./domain";

export const appRouter = router({
  domain: domainRouter,
});

export type AppRouter = typeof appRouter;
