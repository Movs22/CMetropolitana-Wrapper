const { API_BASE, f } = require("../constants");
const ApiError = require("../Errors/ApiError");
const CacheManager = require("./CacheManager");

const Pattern = require("../Classes/Pattern")

class PatternManager {
    /**
     * Creates a PatternManager, responsible for handling this package's bus patterns.
     * @example 
     * #CMetropolitana.patterns = new PatternManager()
     * @constructor
     */
    constructor() {
        this.cache = new CacheManager();
    }

    /**
    * Returns all cached alerts for the specified stop, as a {@link Alert} object.
    * @example 
    * const alerts = await stop.getAlerts()
    * @constructor
    * @returns {Array<Alert>}
    */
    alerts() {
        let ac = require('../index').alerts;
        return ac.forStop(this.id);
    }

    /**
     * Fetches a pattern from its ID.
     * @example 
     * await patterns.fetch('1000_0_0')
     * @param {string} id
     * @returns {Promise<Pattern>}
     */
    async fetch(id) {
        if (id.length !== 8 || id[4] !== "_" || id[6] !== "_") throw new ValidationError("Invalid ID provided. Expected length 8 with the following format: XXXX_X_X. Received length " + id.length + " and ID " + id)
        let pattern = f(API_BASE + "patterns/" + id).then(r => {
            if (r.ok) return r.json();
            throw new ApiError("Failed to fetch info for pattern #" + id + "\nReceived status code " + r.status + " " + r.statusText)
        }).then(r => {
            pattern = new Pattern(id, r);
            return pattern;
        })
        this.cache.__set(id, pattern);
        return await pattern;
    }
}

module.exports = PatternManager;