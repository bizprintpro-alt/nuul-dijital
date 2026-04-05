/**
 * Domain availability checker using RDAP (free, no API key needed)
 */

const DOMAIN_PRICES: Record<string, number> = {
  ".mn": 165000,
  ".com": 62500,
  ".org": 75000,
  ".net": 94600,
  ".shop": 88000,
};

const TLDS = [".mn", ".com", ".org", ".net", ".shop"] as const;

// ── RDAP check ────────────────────────────────────────────────────────

async function checkViaRdap(domain: string): Promise<boolean> {
  try {
    // .mn has its own RDAP server
    const rdapUrl = domain.endsWith(".mn")
      ? `https://rdap.registry.mn/domain/${domain}`
      : `https://rdap.org/domain/${domain}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(rdapUrl, {
      signal: controller.signal,
      headers: { Accept: "application/rdap+json" },
    });

    clearTimeout(timeout);

    // 404 = available, 200 = taken
    if (res.status === 404 || res.status === 400) return true;
    if (res.ok) return false;

    // Other status codes — assume available (can't determine)
    return true;
  } catch {
    // Network error or timeout — assume available (optimistic)
    return true;
  }
}

// ── Cache ─────────────────────────────────────────────────────────────

const cache = new Map<string, { results: DomainResult[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ── Rate limiting ─────────────────────────────────────────────────────

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max requests per minute

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ── Main function ─────────────────────────────────────────────────────

export interface DomainResult {
  domain: string;
  tld: string;
  available: boolean;
  price: number;
}

export async function checkDomainAvailability(
  name: string
): Promise<DomainResult[]> {
  // Sanitize
  const clean = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .replace(/\.[^.]+$/, "");

  if (!clean || clean.length < 2) return [];

  // Check cache
  const cacheKey = clean;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results;
  }

  // Check all TLDs in parallel
  const results = await Promise.all(
    TLDS.map(async (tld) => {
      const fullDomain = `${clean}${tld}`;
      const available = await checkViaRdap(fullDomain);

      return {
        domain: fullDomain,
        tld,
        available,
        price: DOMAIN_PRICES[tld] ?? 0,
      };
    })
  );

  // Cache results
  cache.set(cacheKey, { results, timestamp: Date.now() });

  return results;
}

export { DOMAIN_PRICES, TLDS };
