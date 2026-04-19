/**
 * Returns a promise that resolves after the given delay in milliseconds.
 * @param ms Delay duration in milliseconds.
 * @returns A promise that resolves after the delay.
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
