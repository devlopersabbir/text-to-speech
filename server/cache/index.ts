import NodeCache from "node-cache";
import { CacheType } from "../@types";

/**
 * Class representing a cache manager using NodeCache.
 */
class AshraNodeCache {
  /**
   * The NodeCache instance.
   * @private
   * @type {NodeCache}
   */
  private nodeCache: NodeCache = new NodeCache({
    stdTTL: this.getSencond(10), // 10 minutes TTL for cache entries
    checkperiod: this.getSencond(5), // Check for expired entries every 5 minutes
  });

  /**
   * Stores a value in the cache if the key does not already exist.
   * @template T
   * @param {NodeCache.Key} key - The key under which the value should be stored.
   * @param {T} value - The value to be stored.
   * @returns {void}
   */
  public storeCache<T>(key: NodeCache.Key, value: T): void {
    if (!this.checkIsCache(key)) this.nodeCache.set(key, value);
  }

  /**
   * Retrieves a value from the cache.
   * @param {NodeCache.Key} key - The key of the value to be retrieved.
   * @returns {CacheType | null} - The value from the cache, or null if the key does not exist.
   */
  public getCache(key: NodeCache.Key): CacheType | null {
    if (!this.checkIsCache(key)) return null;
    return this.nodeCache.get(key) as CacheType;
  }

  /**
   * Checks if a key exists in the cache.
   * @private
   * @param {NodeCache.Key} key - The key to check in the cache.
   * @returns {boolean} - True if the key exists, false otherwise.
   */
  private checkIsCache(key: NodeCache.Key): boolean {
    return this.nodeCache.has(key);
  }

  /**
   * Deletes all entries from the cache.
   * @returns {void}
   */
  public deleteCache(): void {
    this.nodeCache.flushAll();
  }

  /**
   * Converts minutes to seconds.
   * @private
   * @param {number} minute - The number of minutes to convert.
   * @returns {number} - The equivalent number of seconds.
   *
   * @example
   * const second = getSecond(100); // returns 6000 seconds
   * console.log(second); // Output: 6000
   */
  private getSencond(minute: number): number {
    return minute * 60;
  }

  /**
   * Updates the TTL (time-to-live) for the cache entries.
   * @param {number} minutes - The new TTL in minutes.
   * @returns {void}
   */
  public updateTTL(minutes: number): void {
    this.nodeCache.options.stdTTL = this.getSencond(minutes);
  }
}

export default new AshraNodeCache();
