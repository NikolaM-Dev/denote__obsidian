export function sortTags(tags: string[]): string[] {
  return tags.sort((a, b) => a.localeCompare(b));
}

export function trim(payload: string): string {
  return payload.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
}
