/**
 * Splits `text` into [{ text, match }] parts, flagging every
 * case-insensitive occurrence of `query`. No regex, so user input is safe.
 */
export function getHighlightParts(text, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [{ text, match: false }];

  const haystack = text.toLowerCase();
  const parts = [];
  let cursor = 0;
  let index = haystack.indexOf(needle, cursor);

  while (index !== -1) {
    if (index > cursor) parts.push({ text: text.slice(cursor, index), match: false });
    parts.push({ text: text.slice(index, index + needle.length), match: true });
    cursor = index + needle.length;
    index = haystack.indexOf(needle, cursor);
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false });
  return parts;
}
