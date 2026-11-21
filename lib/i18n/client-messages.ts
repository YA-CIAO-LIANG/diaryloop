/**
 * Which messages reach the browser. Server Components read every message
 * on the server; only Client Components need them in the page, so the
 * long legal pages and other server-only text never go to the browser.
 */
type Messages = Record<string, unknown>;

/** Used only by Server Components. */
export const SERVER_ONLY_NAMESPACES = ["privacy", "terms", "metadata"] as const;

/** The messages a page sends to the browser. */
export function clientMessages(messages: Messages) {
  const hidden = new Set<string>(SERVER_ONLY_NAMESPACES);
  return Object.fromEntries(
    Object.entries(messages).filter(([namespace]) => !hidden.has(namespace)),
  );
}
