export enum TimeUnit {
  MILLISECOND = 1,
  SECOND = TimeUnit.MILLISECOND * 1000,
  MINUTE = TimeUnit.SECOND * 60,
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function msToFraction(
  amount: number,
  fraction: TimeUnit = TimeUnit.MILLISECOND,
): number {
  return amount * fraction;
}
