/**
 * Sanitize a course title into a safe folder name
 * - Converts spaces to hyphens
 * - Removes special characters like quotes, ?, !, etc.
 * - Lowercases everything for consistency
 */
 function sanitizeName(title) {
  if (!title) return "";

  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")            // replace spaces with hyphens
    .replace(/[^a-z0-9-_]/g, "");    // remove all non-alphanumeric except - and _
}
export default sanitizeName;