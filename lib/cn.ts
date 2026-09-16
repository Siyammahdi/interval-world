/** Tiny className helper — keeps components readable without extra deps */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
