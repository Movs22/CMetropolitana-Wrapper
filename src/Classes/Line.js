const { API_BASE, f } = require("../constants");

class Line {
    /**
     * Creates a Line object based on the specified ID.
     * @example 
     * const line = new Line("1000")
     * @constructor
     * @param {string} id - The ID of the line.
     */
    constructor(id, info) {
        this.id = id;
        Object.keys(info).forEach(k => this[k] = info[k]);
    }


    /**
     * Returns all routes for the specified line, as a {@link Route} object.
     * @example 
     * const routes = await line.getRoutes()
     * @constructor
     * @returns {Promise<Array<Route>>}
     */
    async getRoutes() {
        let rc = require('../index').routes;
        return await Promise.all(this.routes.map(async a => rc.cache.get(a) || await rc.fetch(a)));
    } 

    /**
     * Returns all patterns for the specified line, as a {@link Pattern} object.
     * @example 
     * const routes = await line.getRoutes()
     * @constructor
     * @returns {Promise<Array<Pattern>>}
     */
    async getPatterns() {
        let pc = require('../index').patterns;
        return await Promise.all(this.patterns.map(async a => pc.cache.get(a) || await pc.fetch(a)));
    }   
}

module.exports = Line;