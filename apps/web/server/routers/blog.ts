import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  router,
  publicProcedure,
  protectedProcedure,
  prisma,
} from "@/lib/trpc";

/* ── Admin guard ── */
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Админ эрх шаардлагатай",
    });
  }
  return next({ ctx });
});

export const blogRouter = router({
  /* ═══════════ PUBLIC ═══════════ */

  getPosts: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          search: z.string().optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(50).default(9),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 9;

      const where: any = { status: "PUBLISHED" };
      if (input?.category) {
        where.category = { slug: input.category };
      }
      if (input?.search) {
        where.OR = [
          { title: { contains: input.search, mode: "insensitive" } },
          { excerpt: { contains: input.search, mode: "insensitive" } },
        ];
      }

      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          include: {
            author: { select: { id: true, name: true, image: true } },
            category: { select: { id: true, name: true, slug: true, color: true } },
          },
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.blogPost.count({ where }),
      ]);

      return { posts, total, page, totalPages: Math.ceil(total / limit) };
    }),

  getPost: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await prisma.blogPost.findUnique({
        where: { slug: input.slug },
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
        },
      });

      if (!post || post.status !== "PUBLISHED") {
        throw new TRPCError({ code: "NOT_FOUND", message: "Нийтлэл олдсонгүй" });
      }

      // Increment view count in background
      prisma.blogPost
        .update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } })
        .catch(() => {});

      return post;
    }),

  getFeaturedPosts: publicProcedure.query(async () => {
    return prisma.blogPost.findMany({
      where: { status: "PUBLISHED", featured: true },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
  }),

  getCategories: publicProcedure.query(async () => {
    return prisma.blogCategory.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    });
  }),

  /* ═══════════ ADMIN ═══════════ */

  adminGetPosts: adminProcedure
    .input(
      z
        .object({
          status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(50).default(20),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const where = input?.status ? { status: input.status as any } : {};

      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          include: {
            author: { select: { id: true, name: true } },
            category: { select: { id: true, name: true, slug: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.blogPost.count({ where }),
      ]);

      return { posts, total, page, totalPages: Math.ceil(total / limit) };
    }),

  adminCreatePost: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        coverImage: z.string().optional(),
        videoUrl: z.string().optional(),
        categoryId: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.blogPost.findUnique({
        where: { slug: input.slug },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Энэ slug аль хэдийн бүртгэлтэй байна",
        });
      }

      return prisma.blogPost.create({
        data: {
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          content: input.content,
          coverImage: input.coverImage,
          videoUrl: input.videoUrl,
          authorId: ctx.session.user.id,
          categoryId: input.categoryId || undefined,
          tags: input.tags ?? [],
          status: input.status as any,
          featured: input.featured,
          publishedAt: input.status === "PUBLISHED" ? new Date() : undefined,
        },
      });
    }),

  adminUpdatePost: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional(),
        videoUrl: z.string().optional(),
        categoryId: z.string().nullable().optional(),
        tags: z.array(z.string()).optional(),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      // Check slug uniqueness if changing
      if (data.slug) {
        const existing = await prisma.blogPost.findFirst({
          where: { slug: data.slug, NOT: { id } },
        });
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Энэ slug аль хэдийн бүртгэлтэй байна",
          });
        }
      }

      const updateData: any = { ...data };
      if (data.categoryId === null) {
        updateData.categoryId = null;
      }
      // Set publishedAt when first published
      if (data.status === "PUBLISHED") {
        const post = await prisma.blogPost.findUnique({ where: { id } });
        if (post && !post.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }

      return prisma.blogPost.update({ where: { id }, data: updateData });
    }),

  adminDeletePost: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.blogPost.delete({ where: { id: input.id } });
    }),

  adminCreateCategory: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.blogCategory.create({
        data: {
          name: input.name,
          slug: input.slug,
          color: input.color,
        },
      });
    }),
});
