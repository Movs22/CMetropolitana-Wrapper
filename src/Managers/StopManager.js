const { API_BASE, f } = require("../constants");
const ApiError = require("../Errors/ApiError");
const ValidationError = require("../Errors/ValidationError");
const CacheManager = require("./CacheManager");

const Stop = require("../Classes/Stop")

class StopManager {
    /**
     * Creates a StopManager, responsible for handling this package's bus stops.
     * @example 
     * #CMetropolitana.stops = new StopManager()
     * @constructor
     */
    constructor() {
        this.cache = new CacheManager();
    }

    /**
     * Fetches a bus stop from its ID.
     * @example 
     * await stops.fetch('050000')
     * @param {string} id
     * @returns {Promise<Stop>}
     */
    async fetch(id) {
        if(id.length !== 6) throw new ValidationError("Invalid ID provided. Expected length 6 but received length " + id.length)
        let stop = f(API_BASE + "stops/" + id).then(r => {
            if(r.ok) return r.json(); 
            throw new ApiError("Failed to fetch info for stop #" + id + "\nReceived status code " + r.status + " " + r.statusText)
        }).then(r => {
            stop = new Stop(id, r);
            return stop;
        })
        this.cache.__set(id, stop);
        return await stop;
    }

    /**
     * Fetches all stops and caches them.
     * @example 
     * await stops.fetchAll()
     */
    async fetchAll() {
        let stop;
        let stops = f(API_BASE + "stops").then(r => {
            if(r.ok) return r.json(); 
            throw new ApiError("Failed to fetch info for ALL stops.\nReceived status code " + r.status + " " + r.statusText)
        }).then(s2 => {
            return s2.map(s => {
                stop = new Stop(s.id, s);
                this.cache.__set(s.id, stop);
            })
        })
        return stops;
    }
}

module.exports = StopManager;