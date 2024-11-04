const { API_BASE, f } = require("../constants");

const EventEmitter = require("events")

class Alert extends EventEmitter {
    /**
     * Creates a Stop object based on the specified ID.
     * @example 
     * const stop = new Stop("123456")
     * @constructor
     * @param {string} id - The ID of the bus stop.
     */
    constructor(id, info) {
        super();
        this.id = id;
        this.start = info.alert.activePeriod[0].start;
        this.end = info.alert.activePeriod[0].end;
        if((this.end - Date.now()) < 1000) this.end = null;
        Object.keys(info.alert).forEach(k => k !== "activePeriod" ? this[k] = (info.alert[k].translation ? info.alert[k].translation[0].text : info.alert[k]) : null);
    }

    /**
     * Returns all routes for the specified Alert, as a {@link Pattern} object.
     * @example 
     * const routes = await alert.getRoutes()
     * @constructor
     * @returns {Promise<Array<Route>>}
     */
    async getRoutes() {
        let rc = require('../index').routes;
        return await Promise.all(this.informedEntity.filter(a => a.routeId).map(async a => rc.cache.get(a.routeId) || await rc.fetch(a.routeId)));
    } 

    /**
     * Returns all stops for the specified Alert, as a {@link Pattern} object.
     * @example 
     * const stops = await alert.stops()
     * @constructor
     * @returns {Promise<Array<Stop>>}
     */
    async getStops() {
        let sc = require('../index').stops;
        return await Promise.all(this.informedEntity.filter(a => a.stopId).map(async a => sc.cache.get(a.stopId) || await sc.fetch(a.stopId)));
    } 
}

module.exports = Alert;