export function sanitizeName(title) {
  if (!title) return '';
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces → hyphens
    .replace(/[^a-z0-9-_]/g, ''); // remove special chars
}
