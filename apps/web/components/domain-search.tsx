"use client";

import { useState } from "react";

const tlds = [".mn", ".com", ".org", ".net", ".shop"] as const;
const prices: Record<string, string> = {
  ".mn": "₮165,000",
  ".com": "₮62,500",
  ".org": "₮75,000",
  ".net": "₮94,600",
  ".shop": "₮88,000",
};

interface SearchResult {
  domain: string;
  tld: string;
  available: boolean;
  price: string;
}

export function DomainSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [ordered, setOrdered] = useState<Set<string>>(new Set());

  function doSearch() {
    const val = query.trim();
    if (!val) return;
    const base = val.includes(".") ? val.replace(/\.[^.]+$/, "") : val;

    const mockResults: SearchResult[] = tlds.map((tld) => ({
      domain: `${base}${tld}`,
      tld,
      available: Math.random() > 0.35,
      price: prices[tld],
    }));
    setResults(mockResults);
    setOrdered(new Set());
  }

  function handleOrder(domain: string) {
    setOrdered((prev) => new Set(prev).add(domain));
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[--bdv] bg-gradient-to-br from-[--bg2] to-[--bg3] px-8 py-14 sm:px-12">
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#7B6FFF15,transparent_70%)]" />
      {/* Top line */}
      <div className="pointer-events-none absolute left-[10%] right-[10%] top-0 h-px bg-gradient-to-r from-transparent via-v to-transparent" />

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-v">
          <span className="inline-block h-px w-6 bg-v" />
          Домэйн
        </div>
        <h2 className="mb-2 font-clash text-4xl font-bold tracking-tight">
          Бизнесийн нэрээ
          <br />
          онлайнд гаргаарай
        </h2>
        <p className="mb-8 text-sm text-txt-2">
          Таны брэнд. Таны домэйн. Минутын дотор.
        </p>

        {/* Search box */}
        <div className="mb-4 flex gap-2.5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
            placeholder="жишээ: miniibiznes.mn"
            className="search-input flex-1 rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-3.5 font-cabinet text-[15px] text-txt outline-none transition-all placeholder:text-txt-3"
          />
          <button
            onClick={doSearch}
            className="whitespace-nowrap rounded-xl bg-gradient-to-br from-v to-v-dark px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_#7B6FFF30] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_#7B6FFF50]"
          >
            Хайх
          </button>
        </div>

        {/* TLD pills */}
        <div className="flex flex-wrap gap-2">
          {tlds.map((tld) => (
            <div
              key={tld}
              className="cursor-pointer rounded-lg border border-[--bd] bg-white/[0.02] px-3.5 py-1.5 text-xs text-txt-3 transition-all hover:border-[--bdv] hover:text-v-soft"
            >
              <b className="text-v-soft">{tld}</b> {prices[tld]}
            </div>
          ))}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-xl border border-[--bdv] bg-bg">
            {results.map((r) => (
              <div
                key={r.domain}
                className="flex items-center justify-between border-b border-[--bd] px-5 py-3 text-xs last:border-b-0 hover:bg-white/[0.01]"
              >
                <span className="font-medium text-txt">{r.domain}</span>
                <span
                  className={
                    r.available
                      ? "font-semibold text-t"
                      : "text-red-400"
                  }
                >
                  {r.available ? "✓ Боломжтой" : "✗ Авагдсан"}
                </span>
                <span className="text-txt-2">{r.price}</span>
                {r.available ? (
                  <button
                    onClick={() => handleOrder(r.domain)}
                    className={`rounded-md px-3.5 py-1 text-[11px] font-bold transition-all ${
                      ordered.has(r.domain)
                        ? "bg-t text-black"
                        : "bg-gradient-to-br from-v to-v-dark text-white hover:shadow-[0_0_16px_#7B6FFF40]"
                    }`}
                  >
                    {ordered.has(r.domain) ? "✓ Сагсанд" : "Захиал��х"}
                  </button>
                ) : (
                  <span className="text-txt-3">—</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
