export function sortTags(tags: string[]): string[] {
  return tags.sort((a, b) => a.localeCompare(b));
}
