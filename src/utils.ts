export function sortTags(tags: string[]): string[] {
  return tags.sort((a, b) => a.localeCompare(b));
}

export function trim(payload: string): string {
  return payload.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
