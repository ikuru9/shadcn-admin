export interface MemoizeOptions<A extends unknown[], R, H = unknown> {
  /**
   * Provides a single value to use as the Key for the memoization.
   * Defaults to `JSON.stringify` (ish).
   */
  hash?: (...args: A) => H;

  /**
   * The Cache implementation to provide. Must be a Map or Map-alike.
   * Defaults to a Map. Useful for replacing the cache with an LRU cache or similar.
   */
  cache?: Map<H, R>;
}

export type MemoizableFunction<A extends unknown[], R, T> = (this: T, ...args: A) => R;

export function defaultHash<A extends unknown[], H>(...args: A): H {
  // JSON.stringify ellides `undefined` and function values by default. We do not want that.
  return JSON.stringify(args, (_: unknown, v: unknown) => (typeof v === "object" ? v : String(v))) as H;
}

export function memoize<A extends unknown[], R, T, H>(
  fn: MemoizableFunction<A, R, T>,
  opts: MemoizeOptions<A, R, H> = {},
): MemoizableFunction<A, R, T> {
  const { hash = defaultHash, cache = new Map<H, R>() } = opts;
  return function (this: T, ...args: A): R {
    const id = hash.apply(this, args);
    const cachedValue = cache.get(id);

    if (cachedValue !== undefined || cache.has(id)) {
      return cachedValue as R;
    }

    let result = fn.apply(this, args);
    if (result instanceof Promise) {
      // eslint-disable-next-line github/no-then
      result = result.catch((error) => {
        cache.delete(id);
        throw error;
      }) as R;
    }
    cache.set(id, result);
    return result;
  };
}
