class CacheManager {
    /**
     * Creates a CacheManager, responsible for handling this package's caches.
     * @example 
     * const stop = new CacheManager()
     * @constructor
     */
    constructor() {
        this._cache = {};
    }

    /**
     * Returns a value stored in the cache under the supplied key.
     * @example 
     * const value = cache.get('key')
     * @param {string} key
     * @returns {*}
     */
    get(key) {
        return this._cache[key] || null;
    }

    /**
     * Returns the size of the given cache.
     * @example 
     * cache.size()
     * @returns {int}
     */
    size() {
        return Object.keys(this._cache).length;
    }

    /**
     * Adds a value to be cached under the supplied key.
     * @example 
     * cache.__set('key', value)
     * @param {string} key
     */
    __set(key, value) {
        this._cache[key] = value;
    }

    /**
     * Finds a value stored in the cache.
     * @example 
     * const value = cache.find(a => a.id === '000000')
     * @param {function} predicate 
     * @returns {*}
     */
    find(predicate) {
        return this._cache.some(predicate) || null;
    }
}



module.exports = CacheManager;