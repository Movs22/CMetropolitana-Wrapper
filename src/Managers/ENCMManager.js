const { API_BASE, f } = require("../constants");
const ApiError = require("../Errors/ApiError");
const CacheManager = require("./CacheManager");

class ENCMManager {
    /**
     * Creates a ENCMManager.
     * @example 
     * #CMetropolitana.encm = new ENCMManager()
     * @constructor
     */
    constructor() {
        this.cache = new CacheManager();
    }

    /**
     * Fetches a ENCM from its ID.
     * @example 
     * await encms.fetch('8400000000000001')
     * @param {string} id
     * @returns {Object}
     */
    async fetch(id) {
        let encm = f(API_BASE + "datasets/facilities/encm/" + id).then(r => {
            if(r.ok) return r.json(); 
            throw new ApiError("Failed to fetch info for ENCM #" + id + "\nReceived status code " + r.status + " " + r.statusText)
        }).then(r => {
            let sc = require('../index').stops;
            r.getStops = async () => await Promise.all(r.stops.map(async a => sc.cache.get(a) || await sc.fetch(a)));
            return r;
        })
        this.cache.__set(id, encm);
        return await encm;
    }

    /**
     * Fetches all ENCMs and caches them.
     * @example 
     * await encms.fetchAll()
     */
    async fetchAll() {
        let stops = f(API_BASE + "datasets/facilities/encm").then(r => {
            if(r.ok) return r.json(); 
            throw new ApiError("Failed to fetch info for ALL ENCMs.\nReceived status code " + r.status + " " + r.statusText)
        }).then(s2 => {
            return s2.map(s => {
                let sc = require('../index').stops;
                s.getStops = async () => await Promise.all(r.stops.map(async a => sc.cache.get(a) || await sc.fetch(a)));
                this.cache.__set(s.id, s);
                return s;
            })
        })
        return stops;
    }
}

module.exports = ENCMManager;