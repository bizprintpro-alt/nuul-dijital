"use client";

import { useState } from "react";
import { Check, X, ShoppingCart } from "lucide-react";
import type { DomainResult } from "./DomainSearch";

export function DomainResults({ results }: { results: DomainResult[] }) {
  const [cart, setCart] = useState<Set<string>>(new Set());

  function toggleCart(domain: string) {
    setCart((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });
  }

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-txt">Хайлтын үр дүн</h3>
        {cart.size > 0 && (
          <button className="flex items-center gap-2 rounded-lg bg-v px-4 py-2 text-[12px] font-bold text-white shadow-[0_0_16px_rgba(108,99,255,0.25)] transition-all hover:shadow-[0_0_24px_rgba(108,99,255,0.4)]">
            <ShoppingCart size={13} />
            Сагс ({cart.size}) — Үргэлжлүүлэх
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[0.04]">
        {results.map((r) => (
          <div
            key={r.domain}
            className="flex items-center justify-between border-b border-white/[0.03] px-5 py-3.5 transition-all last:border-b-0 hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-3">
              {r.available ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-t/10">
                  <Check size={12} className="text-t" />
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10">
                  <X size={12} className="text-red-400" />
                </div>
              )}
              <div>
                <span className="text-[13px] font-semibold text-txt">{r.domain}</span>
                <span className="ml-2 text-[11px] text-txt-3">
                  {r.available ? "Боломжтой" : "Авагдсан"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-txt">
                ₮{r.price.toLocaleString()}
                <span className="font-normal text-txt-3">/жил</span>
              </span>
              {r.available ? (
                <button
                  onClick={() => toggleCart(r.domain)}
                  className={`rounded-lg px-4 py-1.5 text-[12px] font-bold transition-all ${
                    cart.has(r.domain)
                      ? "bg-t text-black"
                      : "bg-v/10 text-v-soft hover:bg-v/20"
                  }`}
                >
                  {cart.has(r.domain) ? "✓ Сагсанд" : "Сонгох"}
                </button>
              ) : (
                <span className="rounded-lg bg-white/[0.03] px-4 py-1.5 text-[12px] text-txt-4">
                  —
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
