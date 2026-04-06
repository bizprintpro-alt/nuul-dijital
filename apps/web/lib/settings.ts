import { prisma } from "@/lib/prisma";

// In-memory cache
let cache: Record<string, string> = {};
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

export async function getSetting(key: string): Promise<string | null> {
  if (Date.now() - cacheTime > CACHE_TTL) {
    const all = await prisma.siteSetting.findMany();
    cache = Object.fromEntries(all.map((s) => [s.key, s.value]));
    cacheTime = Date.now();
  }
  return cache[key] ?? null;
}

export async function getSettings(
  group: string
): Promise<Record<string, string>> {
  const settings = await prisma.siteSetting.findMany({ where: { group } });
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export async function updateSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value, type: "text", group: "general", label: key },
  });
  cache[key] = value;
}
