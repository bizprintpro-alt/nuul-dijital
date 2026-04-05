"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { DomainResults } from "./DomainResults";

const tlds = [".mn", ".com", ".org", ".net", ".shop"] as const;
const prices: Record<string, number> = {
  ".mn": 165000, ".com": 62500, ".org": 75000, ".net": 94600, ".shop": 88000,
};

export interface DomainResult {
  domain: string;
  tld: string;
  available: boolean;
  price: number;
}

export function DomainSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DomainResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    const val = query.trim();
    if (!val) return;
    setLoading(true);

    const base = val.includes(".") ? val.replace(/\.[^.]+$/, "") : val;

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 600));

    const mockResults: DomainResult[] = tlds.map((tld) => ({
      domain: `${base}${tld}`,
      tld,
      available: Math.random() > 0.35,
      price: prices[tld],
    }));
    setResults(mockResults);
    setLoading(false);
  }

  return (
    <div>
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Домэйн нэрээ оруулна уу (жишээ: miniibiznes)"
            className="h-12 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-11 pr-4 text-sm text-txt outline-none transition-all placeholder:text-txt-3 focus:border-v/30 focus:bg-white/[0.04]"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-v px-6 text-sm font-bold text-white shadow-[0_0_20px_rgba(108,99,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(108,99,255,0.4)] disabled:opacity-50"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            "Хайх"
          )}
        </button>
      </div>

      {/* TLD quick pills */}
      <div className="mt-3 flex flex-wrap gap-2">
        {tlds.map((tld) => (
          <button
            key={tld}
            onClick={() => { setQuery((q) => (q || "example") + ""); handleSearch(); }}
            className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 text-[11px] text-txt-3 transition-all hover:border-v/20 hover:text-v-soft"
          >
            <b className="text-v-soft">{tld}</b>{" "}
            ₮{prices[tld].toLocaleString()}
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length > 0 && <DomainResults results={results} />}
    </div>
  );
}
