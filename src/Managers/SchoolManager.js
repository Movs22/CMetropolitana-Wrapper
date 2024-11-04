const { API_BASE, f } = require("../constants");
const ApiError = require("../Errors/ApiError");
const CacheManager = require("./CacheManager");

class SchoolManager {
    /**
     * Creates a SchoolManager.
     * @example 
     * #CMetropolitana.schools = new SchoolManager()
     * @constructor
     */
    constructor() {
        this.cache = new CacheManager();
    }

    /**
     * Fetches a school from its ID.
     * @example 
     * await schools.fetch('200098')
     * @param {string} id
     * @returns {Object}
     */
    async fetch(id) {
        let encm = f(API_BASE + "datasets/facilities/schools/" + id).then(r => {
            if(r.ok) return r.json(); 
            throw new ApiError("Failed to fetch info for school #" + id + "\nReceived status code " + r.status + " " + r.statusText)
        }).then(r => {
            let sc = require('../index').stops;
            r.getStops = async () => await Promise.all(r.stops.map(async a => sc.cache.get(a) || await sc.fetch(a)));
            return r;
        })
        this.cache.__set(id, encm);
        return await encm;
    }

    /**
     * Fetches all schools and caches them.
     * @example 
     * await schools.fetchAll()
     */
    async fetchAll() {
        let stops = f(API_BASE + "datasets/facilities/schools").then(r => {
            if(r.ok) return r.json(); 
            throw new ApiError("Failed to fetch info for ALL schools\nReceived status code " + r.status + " " + r.statusText)
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

module.exports = SchoolManager;