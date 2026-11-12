const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Prefix a file from /public with the base path (needed on GitHub Pages). */
export function asset(path: string) {
  if (!path.startsWith('/')) return path;
  return `${base}${path}`;
}
