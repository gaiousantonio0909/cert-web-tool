import type { ShortcodeMap } from '../types';

const SHORTCODE_RE = /\{\{(\w+)\}\}/g;

/**
 * Replace `{{key}}` tokens in `html` with values from `data`.
 * If `removeUnknown` is true, unmatched tokens are removed.
 */
export function parseShortcodes(
  html: string,
  data: ShortcodeMap,
  removeUnknown = false,
): string {
  return html.replace(SHORTCODE_RE, (match, key: string) => {
    if (key in data) return data[key];
    return removeUnknown ? '' : match;
  });
}

/**
 * Extract all unique shortcode keys from an HTML string.
 */
export function extractShortcodes(html: string): string[] {
  const keys = new Set<string>();
  let m: RegExpExecArray | null;
  const re = new RegExp(SHORTCODE_RE.source, 'g');
  while ((m = re.exec(html)) !== null) {
    keys.add(m[1]);
  }
  return [...keys];
}
