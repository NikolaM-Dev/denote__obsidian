export function removeConsecutiveSpaces(payload: string): string {
  return payload.replace(/\s+/g, ' ');
}
