const { API_BASE, f } = require("../constants");

class Route {
    /**
     * Creates a Route object based on the specified ID.
     * @example 
     * const route = new Route("1000_0")
     * @constructor
     * @param {string} id - The ID of the route.
     */
    constructor(id, info) {
        this.id = id;
        Object.keys(info).forEach(k => this[k] = info[k]);
        let lc = require('../index').lines;
        this.parent = () => lc.cache.get(this.line_id) || lc.fetch(this.line_id)
    }

    /**
     * Returns all patterns for the specified line, as a {@link Pattern} object.
     * @example 
     * const patterns = await line.getPatterns()
     * @constructor
     * @returns {Promise<Array<Pattern>>}
     */
    async getPatterns() {
        let pc = require('../index').patterns;
        return await Promise.all(this.patterns.map(async a => pc.cache.get(a) || await pc.fetch(a)));
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
        return ac.forRoute(this.id);
    } 
}

module.exports = Route;