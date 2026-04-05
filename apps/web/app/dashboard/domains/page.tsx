"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { Globe, Search, AlertTriangle, ShoppingCart, Loader2 } from "lucide-react";

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 animate-pulse rounded bg-bg-3" />
        <div className="h-3 w-32 animate-pulse rounded bg-bg-3" />
      </div>
      <div className="h-4 w-16 animate-pulse rounded bg-bg-3" />
      <div className="h-3 w-24 animate-pulse rounded bg-bg-3" />
    </div>
  );
}

export default function DomainsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderingDomain, setOrderingDomain] = useState<string | null>(null);

  const searchResults = trpc.domain.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const userDomains = trpc.domain.getUserDomains.useQuery();

  const orderDomain = trpc.domain.orderDomain.useMutation({
    onSuccess: () => {
      setOrderingDomain(null);
      userDomains.refetch();
    },
    onError: () => {
      setOrderingDomain(null);
    },
  });

  function handleOrder(domain: string, tld: string) {
    const name = domain.replace(tld, "");
    setOrderingDomain(domain);
    orderDomain.mutate({ name, tld: tld as ".mn" | ".com" | ".org" | ".net" | ".shop" });
  }

  function getDaysUntilExpiry(expiresAt: string | Date | null): number | null {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold tracking-tight text-txt">
          Домэйн захиалах
        </h1>
        <p className="mt-1 text-[13px] text-txt-3">
          Бизнесийн нэрээ онлайнд бүртгүүлээрэй
        </p>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-3"
          />
          <input
            type="text"
            placeholder="Домэйн нэр хайх... (жнь: miniishop)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-bg px-4 py-3 pl-11 text-[13px] text-txt placeholder:text-txt-3 focus:border-v/30 focus:outline-none focus:ring-1 focus:ring-v/20"
          />
        </div>

        {/* Search results */}
        {searchQuery.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 size={20} className="animate-spin text-v" />
                <span className="ml-2 text-[13px] text-txt-3">Хайж байна...</span>
              </div>
            ) : searchResults.isError ? (
              <p className="py-4 text-center text-[13px] text-red-400">
                Хайлтанд алдаа гарлаа
              </p>
            ) : searchResults.data?.length === 0 ? (
              <p className="py-4 text-center text-[13px] text-txt-3">
                Үр дүн олдсонгүй
              </p>
            ) : (
              searchResults.data?.map((result) => (
                <div
                  key={result.domain}
                  className="flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={16} className={result.available ? "text-t" : "text-txt-3"} />
                    <span className="text-[13px] font-medium text-txt">
                      {result.domain}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-txt">
                    ₮{result.price.toLocaleString()}
                  </span>
                  {result.available ? (
                    <button
                      onClick={() => handleOrder(result.domain, result.tld)}
                      disabled={orderingDomain === result.domain}
                      className="flex items-center gap-1.5 rounded-lg bg-v px-3 py-1.5 text-[11px] font-bold text-white transition-all hover:bg-v/80 disabled:opacity-50"
                    >
                      {orderingDomain === result.domain ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <ShoppingCart size={12} />
                      )}
                      Захиалах
                    </button>
                  ) : (
                    <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">
                      Бүртгэлтэй
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {orderDomain.isError && (
          <p className="mt-3 text-[13px] text-red-400">
            Захиалга үүсгэхэд алдаа гарлаа: {orderDomain.error.message}
          </p>
        )}
        {orderDomain.isSuccess && (
          <p className="mt-3 text-[13px] text-t">
            Захиалга амжилттай үүслээ! Домэйн: {orderDomain.data.domain}
          </p>
        )}
      </div>

      {/* My Domains */}
      <div className="mt-6 rounded-2xl border border-white/[0.04] bg-bg-2 p-6">
        <h3 className="mb-4 font-syne text-base font-bold text-txt">
          Миний домэйнууд
        </h3>
        {userDomains.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : userDomains.isError ? (
          <p className="text-[13px] text-red-400">Ачааллахад алдаа гарлаа</p>
        ) : !userDomains.data || userDomains.data.length === 0 ? (
          <p className="text-[13px] text-txt-3">Домэйн байхгүй байна</p>
        ) : (
          <div className="space-y-2">
            {userDomains.data.map((d) => {
              const daysLeft = getDaysUntilExpiry(d.expiresAt);
              const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 30;
              const isExpired = daysLeft !== null && daysLeft <= 0;

              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={16} className="text-v" />
                    <span className="text-[13px] font-medium text-txt">
                      {d.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {(isExpiringSoon || isExpired) && (
                      <div className="flex items-center gap-1 text-[11px] text-[#FFB02E]">
                        <AlertTriangle size={12} />
                        {isExpired
                          ? "Хугацаа дууссан"
                          : `${daysLeft} хоног үлдсэн`}
                      </div>
                    )}
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        d.status === "ACTIVE"
                          ? "bg-t/15 text-t"
                          : d.status === "PENDING"
                            ? "bg-[#FFB02E]/15 text-[#FFB02E]"
                            : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {d.status === "ACTIVE"
                        ? "Идэвхтэй"
                        : d.status === "PENDING"
                          ? "Хүлээгдэж буй"
                          : d.status}
                    </span>
                    <span className="text-[12px] text-txt-3">
                      Дуусах:{" "}
                      {d.expiresAt
                        ? new Date(d.expiresAt).toLocaleDateString("mn-MN")
                        : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
