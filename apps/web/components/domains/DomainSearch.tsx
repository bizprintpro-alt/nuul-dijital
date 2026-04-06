"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, Globe, ShoppingCart, CheckCircle, X as XIcon, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc-client";
import { generateSuggestions } from "@/lib/domain-suggestions";
import { PaymentModal } from "@/components/payments/PaymentModal";

const TLD_BADGES = [".mn", ".com", ".org", ".net", ".shop"] as const;

interface QPayState {
  invoiceId: string;
  qrImage: string;
  shortUrl?: string;
  deeplinks?: Array<{ name: string; description: string; logo: string; link: string }>;
  amount: number;
}

export function DomainSearch() {
  const { data: session } = useSession();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [ordering, setOrdering] = useState<string | null>(null);
  const [qpay, setQpay] = useState<QPayState | null>(null);
  const [successDomain, setSuccessDomain] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce 600ms
  useEffect(() => {
    const timer = setTimeout(() => {
      const clean = query.trim().toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/\.[^.]+$/, "");
      if (clean.length >= 2) setDebouncedQuery(clean);
      else setDebouncedQuery("");
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);

  // RDAP-based search
  const searchResults = trpc.domain.search.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 2 }
  );

  const orderDomain = trpc.domain.orderDomain.useMutation();

  // Generate suggestions if main .mn is taken
  const mainTaken = searchResults.data?.find((r) => r.tld === ".mn" && !r.available);
  const suggestions = mainTaken ? generateSuggestions(debouncedQuery) : [];

  async function handleOrder(domain: string, tld: string) {
    if (!session?.user) {
      router.push(`/auth/signin?callbackUrl=/dashboard/domains`);
      return;
    }

    const name = domain.replace(tld, "");
    setOrdering(domain);

    try {
      const result = await orderDomain.mutateAsync({ name, tld: tld as ".mn" | ".com" | ".org" | ".net" | ".shop" });

      // Create QPay invoice
      const res = await fetch("/api/payments/qpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: result.orderId,
          amount: result.amount,
          description: `${domain} домэйн бүртгэл`,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setQpay({
          invoiceId: data.invoiceId,
          qrImage: data.qrImage,
          shortUrl: data.shortUrl,
          deeplinks: data.deeplinks,
          amount: result.amount,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Алдаа гарлаа";
      alert(message);
    } finally {
      setOrdering(null);
    }
  }

  function handleQPaySuccess() {
    setQpay(null);
    setSuccessDomain(debouncedQuery);
    searchResults.refetch();
    setTimeout(() => setSuccessDomain(null), 5000);
  }

  // Validation
  const hasInvalidChars = query.length > 0 && /[^a-zA-Z0-9-.]/.test(query);

  return (
    <div>
      {/* Search input */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-3" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Домэйн нэр хайх... (жнь: miniibiznes)"
          className="w-full rounded-xl border border-white/[0.06] bg-bg px-4 py-3.5 pl-11 text-sm text-txt placeholder:text-txt-3 outline-none transition focus:border-v/30 focus:ring-1 focus:ring-v/20"
        />
        {searchResults.isFetching && (
          <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-v" />
        )}
      </div>

      {/* Validation error */}
      {hasInvalidChars && (
        <p className="mt-2 text-[12px] text-red-400">Зөвхөн латин үсэг (a-z), тоо (0-9), зураас (-) ашиглана уу</p>
      )}

      {/* TLD badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        {TLD_BADGES.map((tld) => (
          <button
            key={tld}
            onClick={() => {
              if (!query) return;
              setQuery(query.replace(/\.[^.]*$/, "") + tld);
            }}
            className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 text-[11px] transition hover:border-v/20 hover:text-v-soft"
          >
            <span className="font-bold text-v-soft">{tld}</span>
          </button>
        ))}
      </div>

      {/* Success message */}
      {successDomain && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-t/10 border border-t/20 px-4 py-3">
          <CheckCircle size={16} className="text-t" />
          <span className="text-[13px] text-t">Захиалга амжилттай үүслээ! Төлбөр хийсний дараа идэвхжинэ.</span>
        </div>
      )}

      {/* Results */}
      {debouncedQuery.length >= 2 && searchResults.data && (
        <div className="mt-5">
          <h4 className="mb-3 text-[13px] font-semibold text-txt">Хайлтын үр дүн</h4>
          <div className="space-y-2">
            {searchResults.data.map((r) => (
              <div
                key={r.domain}
                className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] px-5 py-3 transition hover:border-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <Globe size={16} className={r.available ? "text-t" : "text-txt-3"} />
                  <div>
                    <span className="text-[13px] font-medium text-txt">{r.domain}</span>
                    <span className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      r.available ? "bg-t/15 text-t" : "bg-red-500/15 text-red-400"
                    }`}>
                      {r.available ? "Боломжтой" : "Авагдсан"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-txt">
                    ₮{r.price.toLocaleString()}<span className="text-[11px] font-normal text-txt-3">/жил</span>
                  </span>
                  {r.available ? (
                    <button
                      onClick={() => handleOrder(r.domain, r.tld)}
                      disabled={ordering === r.domain}
                      className="flex items-center gap-1.5 rounded-lg bg-v px-3.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-v-dark disabled:opacity-50"
                    >
                      {ordering === r.domain ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <ShoppingCart size={12} />
                      )}
                      Захиалах
                    </button>
                  ) : (
                    <span className="rounded-lg bg-white/[0.03] px-3.5 py-1.5 text-[11px] text-txt-4">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {debouncedQuery.length >= 2 && searchResults.isFetching && !searchResults.data && (
        <div className="mt-5 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-white/[0.04] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-pulse rounded bg-bg-3" />
                <div className="h-3 w-32 animate-pulse rounded bg-bg-3" />
              </div>
              <div className="h-3 w-20 animate-pulse rounded bg-bg-3" />
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-v" />
            <h4 className="text-[13px] font-semibold text-txt">Санал болгох нэрүүд</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); }}
                className="rounded-lg border border-v/20 bg-v/5 px-3 py-1.5 text-[12px] text-v-soft transition hover:bg-v/10"
              >
                {s}.mn
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QPay Modal */}
      {qpay && (
        <PaymentModal
          open={true}
          onClose={() => setQpay(null)}
          onSuccess={handleQPaySuccess}
          invoiceId={qpay.invoiceId}
          qrImage={qpay.qrImage}
          shortUrl={qpay.shortUrl}
          deeplinks={qpay.deeplinks}
          amount={qpay.amount}
        />
      )}
    </div>
  );
}
