function toKebabCase(payload: string): string {
  // Replace whitespace with hyphens
  let result = payload.replace(/\s+/g, '-');

  // Replace problematic symbols
  result = result.replace(/\//g, '-').replace(/\\/g, '-');

  // Remove any characters that are not alphanumeric or hyphens
  result = result.replace(/[^a-zA-Z0-9-]/g, '');

  // Convert to lowercase
  result = result.toLowerCase();

  // Remove leading/trailing hyphens
  result = result.replace(/^-+|-+$/g, '');

  // Replace multiple consecutive hyphens with a single hyphen
  result = result.replace(/-+/g, '-');

  return result;
}
