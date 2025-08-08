export type ITags = undefined | null | string | string[];

export function getSlug(title: string): string {
  return toKebabCase(title);
}

export function getFormatTags(tags: string[]): string {
  const sanitizedTags = sanitizeTags(tags);
  if (sanitizedTags.length <= 0) return '';

  const formattedTags = sanitizedTags.map((tag) => toKebabCase(tag));

  return `__${formattedTags.join('_')}`;
}

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

function sanitizeTags(tags: ITags): string[] {
  const fallbackTags: string[] = [];
  let verifiedTags = fallbackTags;

  switch (typeof tags) {
    case 'undefined':
      // Explicity setting verifiedTags to use fallbackTags
      verifiedTags = fallbackTags;
      break;

    case 'string':
      // Change one single tag to array format
      verifiedTags = [tags];
      break;

    case 'object':
      // When tags is null, just use fallbackTags
      if (tags === null) {
        verifiedTags = fallbackTags;
        break;
      }

      // Remove null tags
      if (Array.isArray(tags)) {
        verifiedTags = tags.filter((tag: string) => tag !== null);
      }

      // sanitaizedTags after filter is an empty array, use fallbackTags
      if (verifiedTags.length === 0) verifiedTags = fallbackTags;

      break;
  }

  const trimmedTags = verifiedTags.map((tag) => trim(tag));
  const sortedTags = sortTags(trimmedTags);

  return sortedTags;
}

function trim(payload: string): string {
  return payload.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
}

function sortTags(tags: string[]): string[] {
  return tags.sort((a, b) => a.localeCompare(b));
}
