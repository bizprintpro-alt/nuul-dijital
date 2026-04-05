"use client";

import { useState } from "react";
import Link from "next/link";

const domainPricing: Record<string, number> = {
  ".mn": 25000,
  ".com.mn": 15000,
  ".org.mn": 15000,
  ".com": 35000,
  ".org": 40000,
  ".net": 38000,
};

interface SearchResult {
  domain: string;
  tld: string;
  available: boolean;
  price: number;
}

export default function DomainSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const name = query.trim().toLowerCase().replace(/\s+/g, "-");

    // Simulate domain availability check
    const mockResults: SearchResult[] = Object.entries(domainPricing).map(
      ([tld, price]) => ({
        domain: `${name}${tld}`,
        tld,
        available: Math.random() > 0.3, // 70% available for demo
        price,
      })
    );

    setResults(mockResults);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-brand-600">
            Nuul.mn
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Нүүр
            </Link>
            <Link
              href="/auth/signin"
              className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
            >
              Нэвтрэх
            </Link>
          </nav>
        </div>
      </header>

      {/* Search Section */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-center text-4xl font-bold text-gray-900">
          Домэйн нэр хайх
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Өөрийн бизнест тохирох домэйн нэрээ олоорой
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Домэйн нэрээ оруулна уу (жишээ: minii-biznes)"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-8 py-3 text-lg font-medium text-white hover:bg-brand-700"
          >
            Хайх
          </button>
        </form>

        {/* Results */}
        {searched && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Хайлтын үр дүн
            </h2>
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.domain}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        result.available ? "bg-green-500" : "bg-red-400"
                      }`}
                    />
                    <span className="text-lg font-medium text-gray-900">
                      {result.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">
                      ₮{result.price.toLocaleString()}/жил
                    </span>
                    {result.available ? (
                      <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
                        Сагсанд нэмэх
                      </button>
                    ) : (
                      <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-500">
                        Бүртгэлтэй
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domain Pricing Table */}
        <div className="mt-16">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Домэйн үнийн жагсаалт
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(domainPricing).map(([tld, price]) => (
              <div
                key={tld}
                className="rounded-xl border p-6 text-center hover:shadow-md"
              >
                <div className="text-2xl font-bold text-brand-600">{tld}</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">
                  ₮{price.toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-gray-500">/жил</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
