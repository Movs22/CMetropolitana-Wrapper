const { API_BASE, f } = require("../constants");

const EventEmitter = require("events")

class Stop extends EventEmitter {
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
        Object.keys(info).forEach(k => this[k] = info[k]);
    }

    /**
     * Returns all departures for the specified stop, filtered by the provided timestamp (if specified).
     * @example 
     * const departures = await stop.departures(Date.now())
     * @constructor
     * @param {number} [timestamp] - Filters any departures that occured prior to this timestamp
     * @returns {Promise<Array>}
     */
    async departures(timestamp, force) {
        timestamp = timestamp / 1000 || 0;
        return await f(API_BASE + "stops/" + this.id + "/realtime").then(r => {
            if (r.ok) return r.json();
            throw new ApiError("Failed to fetch departures for stop #" + id + "\nReceived status code " + r.status + " " + r.statusText)
        }).then(r => timestamp ? r.filter(a => a.estimated_arrival_unix > timestamp || a.scheduled_arrival_unix > timestamp) : r).then(d => {
            let rc = require('../index').routes;
            let vc = require('../index').vehicles;
            d.map(departure => {
                departure.getRoute = async () => (rc.cache.get(departure.route_id) || await rc.fetch(departure.route_id) );
                departure.getVehicle = async () => departure.vehicle_id === null ? null : vc.cache.get(departure.vehicle_id) || await vc.fetch(departure.vehicle_id) || (force ? await vc.getFromRoute(departure.vehicle_id) : null)
                return departure
            });
            return d;
        })
    }

    /**
     * Returns all routes for the specified stop, as a {@link Route} object.
     * @example 
     * const routes = await stop.getRoutes()
     * @constructor
     * @returns {Promise<Array<Route>>}
     */
    async getRoutes() {
        let rc = require('../index').routes;
        return await Promise.all(this.routes.map(async a => rc.cache.get(a) || await rc.fetch(a)));
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
     * Returns all lines for the specified stop, as a {@link Line} object.
     * @example 
     * const lines = await line.getLines()
     * @constructor
     * @returns {Promise<Array<Line>>}
     */
    async getLines() {
        let lc = require('../index').lines;
        return await Promise.all(this.lines.map(async a => lc.cache.get(a) || await lc.fetch(a)));
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
    * @param {"vehicleArrival" | "vehicleDeparture"} event - The event to listen for. Possible values: 'vehicleArrival', 'vehicleDeparture'.
    * @param {Function} listener - The function to call when the event is emitted.
    * @returns {this}
    */
    on(event, listener) {
        return super.on(event, listener);
    }
}

module.exports = Stop;