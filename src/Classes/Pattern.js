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
    }
}

module.exports = Pattern;