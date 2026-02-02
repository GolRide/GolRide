const TEAM_STOPWORDS = new Set([
  "real",
  "cf",
  "fc",
  "cd",
  "ud",
  "sd",
  "de",
  "del",
  "la",
  "el",
  "los",
  "las",
  "club",
  "s.a.d",
  "sad",
]);

function accentPattern(value: string) {
  const map: Record<string, string> = {
    a: "[aáàäâã]",
    e: "[eéèëê]",
    i: "[iíìïî]",
    o: "[oóòöôõ]",
    u: "[uúùüû]",
    n: "[nñ]",
    c: "[cç]",
  };

  return value
    .split("")
    .map((ch) => {
      const lower = ch.toLowerCase();
      if (map[lower]) return map[lower];
      return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("");
}

export function buildLooseRegex(input: string, { stripTeamWords = false }: { stripTeamWords?: boolean } = {}) {
  const raw = input.trim();
  if (!raw) return null;

  const normalized = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ");

  const tokens = normalized.split(/\s+/).filter(Boolean);
  const filtered = stripTeamWords ? tokens.filter((t) => !TEAM_STOPWORDS.has(t)) : tokens;
  const terms = filtered.length ? filtered : tokens;

  const pattern = terms.length ? terms.map(accentPattern).join("|") : accentPattern(raw);
  return new RegExp(pattern, "i");
}
