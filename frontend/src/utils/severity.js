// Lightweight client-side heuristic to tag news with a severity level
// based on keywords in the title. No backend change needed.
const CRITICAL_KEYWORDS = [
  "critical",
  "zero-day",
  "0-day",
  "rce",
  "remote code execution",
  "actively exploited",
  "ransomware",
  "breach",
];

const HIGH_KEYWORDS = [
  "vulnerability",
  "flaw",
  "exploit",
  "malware",
  "attack",
  "hacker",
  "backdoor",
  "patch",
];

export function getSeverity(title) {
  const lower = title.toLowerCase();
  if (CRITICAL_KEYWORDS.some((kw) => lower.includes(kw))) return "critical";
  if (HIGH_KEYWORDS.some((kw) => lower.includes(kw))) return "high";
  return "info";
}