import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, prisma } from "@/lib/trpc";

export const websiteRouter = router({
  getWebsites: protectedProcedure.query(async ({ ctx }) => {
    return prisma.website.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        subdomain: true,
        domain: true,
        template: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  createWebsite: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        subdomain: z.string().min(2).max(63).regex(/^[a-z0-9-]+$/, "Зөвхөн жижиг үсэг, тоо, зураас"),
        template: z.string().default("blank"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.website.findUnique({
        where: { subdomain: input.subdomain },
      });
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Энэ subdomain аль хэдийн бүртгэлтэй" });
      }

      return prisma.website.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          subdomain: input.subdomain,
          template: input.template,
          status: "DRAFT",
        },
      });
    }),

  getWebsite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const website = await prisma.website.findUnique({ where: { id: input.id } });
      if (!website || website.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Вэбсайт олдсонгүй" });
      }
      return website;
    }),

  saveWebsite: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        gjsData: z.any().optional(),
        htmlContent: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const website = await prisma.website.findUnique({ where: { id: input.id } });
      if (!website || website.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Вэбсайт олдсонгүй" });
      }

      return prisma.website.update({
        where: { id: input.id },
        data: {
          ...(input.gjsData !== undefined && { gjsData: input.gjsData }),
          ...(input.htmlContent !== undefined && { publishedHtml: input.htmlContent }),
        },
      });
    }),

  publishWebsite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const website = await prisma.website.findUnique({ where: { id: input.id } });
      if (!website || website.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Вэбсайт олдсонгүй" });
      }

      return prisma.website.update({
        where: { id: input.id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });
    }),

  unpublishWebsite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const website = await prisma.website.findUnique({ where: { id: input.id } });
      if (!website || website.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Вэбсайт олдсонгүй" });
      }

      return prisma.website.update({
        where: { id: input.id },
        data: { status: "UNPUBLISHED" },
      });
    }),

  deleteWebsite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const website = await prisma.website.findUnique({ where: { id: input.id } });
      if (!website || website.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Вэбсайт олдсонгүй" });
      }

      return prisma.website.delete({ where: { id: input.id } });
    }),

  checkSubdomain: protectedProcedure
    .input(z.object({ subdomain: z.string().min(2).max(63) }))
    .query(async ({ input }) => {
      const existing = await prisma.website.findUnique({
        where: { subdomain: input.subdomain },
      });
      return { available: !existing };
    }),
});
