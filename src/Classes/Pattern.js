const { API_BASE, f } = require("../constants");

class Pattern {
    /**
     * Creates a Pattern object based on the specified ID.
     * @example 
     * const pattern = new Pattern("1000_0_0")
     * @constructor
     * @param {string} id - The ID of the pattern.
     */
    constructor(id, info) {
        this.id = id;
        Object.keys(info).forEach(k => this[k] = info[k]);
        let rc = require('../index').routes;
        this.parent = () => rc.cache.get(this.route_id) || rc.fetch(this.route_id)
        this.__shape = {};
    }

    /**
     * Returns the GeoJSON data for this pattern from its ID.
     * @example 
     * pattern.shape())
     * @returns {Promise<Object>}
     */
    async shape() {
        if(this.__shape) return this.__shape;
        this.__shape = f(API_BASE + "shapes/" + this.shapeId).then(r => {
            if (r.ok) return r.json();
            throw new ApiError("Failed to fetch info for shape #" + this.shapeId + "\nReceived status code " + r.status + " " + r.statusText)
        })
        return await this.__shape;
    }
}

module.exports = Pattern;