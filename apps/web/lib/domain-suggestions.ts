/**
 * Generate domain name suggestions when the main domain is taken
 */

const PREFIXES = ["my", "get", "the", "go", "best", "top", "mn"];
const SUFFIXES = ["pro", "app", "digital", "online", "web", "mn", "store", "hub"];

export function generateSuggestions(name: string): string[] {
  const clean = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 20);

  if (!clean) return [];

  const suggestions = new Set<string>();

  // Prefix variations
  for (const prefix of PREFIXES) {
    if (!clean.startsWith(prefix)) {
      suggestions.add(`${prefix}${clean}`);
    }
  }

  // Suffix variations
  for (const suffix of SUFFIXES) {
    if (!clean.endsWith(suffix)) {
      suggestions.add(`${clean}${suffix}`);
      suggestions.add(`${clean}-${suffix}`);
    }
  }

  // Short variations
  if (clean.length > 5) {
    suggestions.add(clean.slice(0, 5));
  }

  // Return top 8 unique
  return Array.from(suggestions).slice(0, 8);
}
