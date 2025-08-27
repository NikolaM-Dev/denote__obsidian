export function areObjectEquals(x: Object, y: Object): boolean {
  return Object.values(x).toString() === Object.values(y).toString();
}
