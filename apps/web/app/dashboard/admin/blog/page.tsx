// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc-client";
import slugify from "slugify";
import dynamic from "next/dynamic";
import ImageUpload from "@/components/editor/ImageUpload";
import {
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Pencil,
  X,
  Loader2,
  Star,
} from "lucide-react";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-[350px] rounded-xl border border-white/[0.08] bg-white/[0.02]" /> }
);

const statusColors: Record<string, string> = {
  DRAFT: "bg-yellow-500/15 text-yellow-400",
  PUBLISHED: "bg-emerald-500/15 text-emerald-400",
  ARCHIVED: "bg-white/[0.06] text-white/40",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Ноорог",
  PUBLISHED: "Нийтлэгдсэн",
  ARCHIVED: "Архив",
};

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  videoUrl: "",
  categoryId: "",
  tags: "",
  status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
  featured: false,
};

export default function AdminBlogPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", slug: "", color: "" });

  const utils = trpc.useUtils();

  const postsQuery = trpc.blog.adminGetPosts.useQuery({
    status: statusFilter as any,
    page,
    limit: 20,
  });

  const categoriesQuery = trpc.blog.getCategories.useQuery();

  const createPost = trpc.blog.adminCreatePost.useMutation({
    onSuccess: () => {
      utils.blog.adminGetPosts.invalidate();
      setShowForm(false);
      setForm(emptyForm);
    },
  });

  const updatePost = trpc.blog.adminUpdatePost.useMutation({
    onSuccess: () => {
      utils.blog.adminGetPosts.invalidate();
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    },
  });

  const deletePost = trpc.blog.adminDeletePost.useMutation({
    onSuccess: () => {
      utils.blog.adminGetPosts.invalidate();
    },
  });

  const createCategory = trpc.blog.adminCreateCategory.useMutation({
    onSuccess: () => {
      utils.blog.getCategories.invalidate();
      setShowCategoryForm(false);
      setCatForm({ name: "", slug: "", color: "" });
    },
  });

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(post: any) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImage: post.coverImage ?? "",
      videoUrl: post.videoUrl ?? "",
      categoryId: post.categoryId ?? "",
      tags: post.tags?.join(", ") ?? "",
      status: post.status,
      featured: post.featured,
    });
    setShowForm(true);
  }

  function handleSubmit() {
    const tagsArr = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingId) {
      updatePost.mutate({
        id: editingId,
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || undefined,
        content: form.content,
        coverImage: form.coverImage || undefined,
        videoUrl: form.videoUrl || undefined,
        categoryId: form.categoryId || undefined,
        tags: tagsArr,
        status: form.status,
        featured: form.featured,
      });
    } else {
      createPost.mutate({
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || undefined,
        content: form.content,
        coverImage: form.coverImage || undefined,
        videoUrl: form.videoUrl || undefined,
        categoryId: form.categoryId || undefined,
        tags: tagsArr,
        status: form.status,
        featured: form.featured,
      });
    }
  }

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingId && form.title) {
      setForm((f) => ({
        ...f,
        slug: slugify(f.title, { lower: true, strict: true }),
      }));
    }
  }, [form.title, editingId]);

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-syne text-2xl font-bold text-white">
            Блог удирдлага
          </h1>
          <p className="mt-1 text-[13px] text-white/40">
            Нийтлэл нэмэх, засах, устгах
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryForm(true)}
            className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-[13px] font-medium text-white/60 transition-all hover:bg-white/[0.04]"
          >
            + Ангилал
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-[#7B6FFF] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_16px_#7B6FFF40] transition-all hover:bg-[#6B5FEF]"
          >
            <Plus size={15} />
            Шинэ нийтлэл
          </button>
        </div>
      </div>

      {/* ═══ Category creation modal ═══ */}
      {showCategoryForm && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCategoryForm(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0a0a1a] p-6">
            <button
              onClick={() => setShowCategoryForm(false)}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-white/40 hover:bg-white/[0.06]"
            >
              <X size={16} />
            </button>
            <h3 className="mb-4 font-syne text-lg font-bold">Шинэ ангилал</h3>
            <div className="space-y-3">
              <input
                value={catForm.name}
                onChange={(e) => {
                  setCatForm({
                    ...catForm,
                    name: e.target.value,
                    slug: slugify(e.target.value, { lower: true, strict: true }),
                  });
                }}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none focus:border-[#7B6FFF40]"
                placeholder="Ангилалын нэр"
              />
              <input
                value={catForm.slug}
                onChange={(e) =>
                  setCatForm({ ...catForm, slug: e.target.value })
                }
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none focus:border-[#7B6FFF40]"
                placeholder="slug"
              />
              <input
                value={catForm.color}
                onChange={(e) =>
                  setCatForm({ ...catForm, color: e.target.value })
                }
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none focus:border-[#7B6FFF40]"
                placeholder="Өнгө (жишээ: #7B6FFF)"
              />
              <button
                onClick={() => createCategory.mutate(catForm)}
                disabled={!catForm.name || !catForm.slug || createCategory.isPending}
                className="w-full rounded-xl bg-[#7B6FFF] py-3 text-[13px] font-bold text-white disabled:opacity-40"
              >
                {createCategory.isPending ? "Хадгалж байна..." : "Хадгалах"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Post form modal ═══ */}
      {showForm && (
        <div className="fixed inset-0 z-[600] flex items-start justify-center overflow-y-auto p-4 pt-10 pb-10">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowForm(false);
              setEditingId(null);
            }}
          />
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#0a0a1a] p-6">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-white/40 hover:bg-white/[0.06]"
            >
              <X size={16} />
            </button>

            <h3 className="mb-5 font-syne text-lg font-bold">
              {editingId ? "Нийтлэл засах" : "Шинэ нийтлэл"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-white/50">
                  Гарчиг *
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none focus:border-[#7B6FFF40]"
                  placeholder="Нийтлэлийн гарчиг"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-white/50">
                  Slug
                </label>
                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white/60 outline-none focus:border-[#7B6FFF40]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-white/50">
                  Товч тайлбар
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm({ ...form, excerpt: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none focus:border-[#7B6FFF40]"
                  placeholder="Нийтлэлийн товч тайлбар"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-white/50">
                  Агуулга *
                </label>
                <RichTextEditor
                  value={form.content}
                  onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                  placeholder="Нийтлэлийн агуулгаа энд бичнэ үү..."
                />
              </div>

              <ImageUpload
                label="Нүүр зураг (Facebook share-д харагдах)"
                value={form.coverImage}
                onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
              />

              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-white/50">
                  Нэмэлт видео URL (сонголтоор)
                </label>
                <input
                  value={form.videoUrl}
                  onChange={(e) =>
                    setForm({ ...form, videoUrl: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none focus:border-[#7B6FFF40]"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-white/50">
                    Ангилал
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({ ...form, categoryId: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none"
                  >
                    <option value="" className="bg-[#0a0a1a]">
                      Сонгох...
                    </option>
                    {categoriesQuery.data?.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        className="bg-[#0a0a1a]"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-white/50">
                    Төлөв
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none"
                  >
                    <option value="DRAFT" className="bg-[#0a0a1a]">
                      Ноорог
                    </option>
                    <option value="PUBLISHED" className="bg-[#0a0a1a]">
                      Нийтлэх
                    </option>
                    <option value="ARCHIVED" className="bg-[#0a0a1a]">
                      Архив
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-white/50">
                  Тагууд (таслалаар тусгаарлах)
                </label>
                <input
                  value={form.tags}
                  onChange={(e) =>
                    setForm({ ...form, tags: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none focus:border-[#7B6FFF40]"
                  placeholder="технологи, AI, бизнес"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-[#7B6FFF]"
                />
                <span className="flex items-center gap-1 text-[13px] text-white/60">
                  <Star size={13} className="text-[#FFB02E]" />
                  Онцлох нийтлэл
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="rounded-xl border border-white/[0.08] px-6 py-3 text-[13px] text-white/50 transition-all hover:bg-white/[0.04]"
                >
                  Болих
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !form.title ||
                    !form.slug ||
                    !form.content ||
                    createPost.isPending ||
                    updatePost.isPending
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#7B6FFF] py-3 text-[13px] font-bold text-white transition-all hover:bg-[#6B5FEF] disabled:opacity-40"
                >
                  {(createPost.isPending || updatePost.isPending) && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {editingId ? "Хадгалах" : "Нийтлэл үүсгэх"}
                </button>
              </div>

              {(createPost.isError || updatePost.isError) && (
                <p className="text-center text-[12px] text-red-400">
                  {createPost.error?.message ??
                    updatePost.error?.message ??
                    "Алдаа гарлаа"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Status filters ═══ */}
      <div className="mb-4 flex gap-1.5">
        {[
          { label: "Бүгд", value: undefined },
          { label: "Ноорог", value: "DRAFT" },
          { label: "Нийтлэгдсэн", value: "PUBLISHED" },
          { label: "Архив", value: "ARCHIVED" },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => {
              setStatusFilter(s.value);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${
              statusFilter === s.value
                ? "bg-[#7B6FFF20] text-[#9F98FF]"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ═══ Posts table ═══ */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Нийтлэл
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Төлөв
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Уншсан
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Огноо
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/40" />
              </tr>
            </thead>
            <tbody>
              {postsQuery.isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td colSpan={5} className="px-5 py-4">
                      <div className="h-4 w-60 animate-pulse rounded bg-white/[0.04]" />
                    </td>
                  </tr>
                ))}
              {postsQuery.data?.posts?.map((post: any) => (
                <tr
                  key={post.id}
                  className="border-b border-white/[0.04] transition-all hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {post.featured && (
                        <Star
                          size={12}
                          className="text-[#FFB02E]"
                          fill="#FFB02E"
                        />
                      )}
                      <div>
                        <div className="text-[13px] font-medium text-white">
                          {post.title}
                        </div>
                        <div className="text-[11px] text-white/30">
                          {post.category?.name ?? "Ангилалгүй"} &middot;{" "}
                          {post.author?.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        statusColors[post.status] ?? ""
                      }`}
                    >
                      {statusLabels[post.status] ?? post.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-[12px] text-white/40">
                      <Eye size={12} />
                      {post.viewCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-white/40">
                    {new Date(post.createdAt).toLocaleDateString("mn-MN")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(post)}
                        className="rounded-lg p-1.5 text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/60"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm("Энэ нийтлэлийг устгах уу?")
                          ) {
                            deletePost.mutate({ id: post.id });
                          }
                        }}
                        className="rounded-lg p-1.5 text-white/30 transition-all hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!postsQuery.isLoading && postsQuery.data?.posts?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
              <FileText size={20} className="text-white/30" />
            </div>
            <div>
              <div className="text-[14px] font-medium text-white/80">
                Нийтлэл байхгүй байна
              </div>
              <div className="mt-1 text-[12px] text-white/40">
                Эхний нийтлэлээ үүсгэж эхлээрэй
              </div>
            </div>
            <button
              onClick={openCreate}
              className="mt-2 flex items-center gap-2 rounded-xl bg-v px-4 py-2 text-[12px] font-bold text-white transition-all hover:bg-v-dark"
            >
              <Plus size={13} />
              Шинэ нийтлэл
            </button>
          </div>
        )}

        {/* Pagination */}
        {postsQuery.data && postsQuery.data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
            <span className="text-[12px] text-white/40">
              {postsQuery.data.total} нийтлэл
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-white/60 transition-all hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-2 text-[12px] font-medium text-white/70">
                {page} / {postsQuery.data.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(postsQuery.data!.totalPages, p + 1)
                  )
                }
                disabled={page === postsQuery.data.totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-white/60 transition-all hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
