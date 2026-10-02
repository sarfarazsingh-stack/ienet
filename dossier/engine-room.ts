const PATTERNS: { label: string; re: RegExp }[] = [
  { label: "synergy", re: /\bsynerg(?:y|ies|istic)\b/i },
  { label: "paradigm", re: /\bparadigms?\b/i },
  { label: "disrupt", re: /\bdisrupt(?:s|ion|ive|or)?\b/i },
  { label: "exponential", re: /\bexponential(?:ly)?\b/i },
  { label: "unicorn", re: /\bunicorns?\b/i },
  { label: "10x", re: /\b10\s*x\b/i },
  { label: "leverage", re: /\bleverage[ds]?\b/i },
  { label: "ai wrapper", re: /\bai[\s-]*wrapper\b/i },
];

export type EngineVerdict =
  | { status: "empty" }
  | { status: "rejected"; matches: string[] }
  | { status: "accepted" };

export function judgeEngineRoom(input: string): EngineVerdict {
  const text = input.trim();
  if (!text) return { status: "empty" };
  const matches = PATTERNS.filter((pattern) => pattern.re.test(text)).map((pattern) => pattern.label);
  if (matches.length > 0) return { status: "rejected", matches };
  return { status: "accepted" };
}
