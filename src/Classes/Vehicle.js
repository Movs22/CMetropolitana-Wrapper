const EventEmitter = require("events")

class Vehicle extends EventEmitter {
    /**
     * Creates a Vehicle object based on the specified vehicle ID.
     * @example 
     * const pattern = new Pattern("1000_0_0")
     * @constructor
     * @param {string} id - The ID of the pattern.
     */
    constructor(id, info) {
        super();
        this.id = id;
        Object.keys(info).forEach(k => this[k] = info[k]);
        let pc = require('../index').patterns;
        this.parent = () => pc.cache.get(this.pattern_id) || pc.fetch(this.pattern_id)
    }

    __update(info) {
        Object.keys(info).forEach(k => this[k] = info[k]);
    }

    /**
     * Returns the line for the specified vehicle, as a {@link Line} object.
     * @example 
     * const line = await vehicle.getLine()
     * @constructor
     * @returns {Promise<Line>}
     */
    async getLine() {
        if(!this.line_id) return null;
        let lc = require('../index').lines;
        return lc.cache.get(this.line_id) || await lc.fetch(this.line_id);
    }  

    /**
     * Returns the route for the specified vehicle, as a {@link Route} object.
     * @example 
     * const route = await vehicle.getRoute()
     * @constructor
     * @returns {Promise<Line>}
     */
    async getRoute() {
        if(!this.line_id) return null;
        let rc = require('../index').routes;
        return rc.cache.get(this.route_id) || await rc.fetch(this.route_id);
    }  
    
    /**
     * Returns the pattern for the specified vehicle, as a {@link Pattern} object.
     * @example 
     * const pattern = await vehicle.getPattern()
     * @constructor
     * @returns {Promise<Pattern>}
     */
    async getPattern() {
        if(!this.pattern_id) return null;
        let pc = require('../index').patterns;
        return pc.cache.get(this.pattern_id) || await pc.fetch(this.pattern_id);
    }  

    /**
     * Returns the current position for the specified vehicle.
     * @example 
     * const pos = await vehicle.getPosition()
     * @constructor
     * @returns {Array<Number>}
     */
    async getPosition() {
        if(!this.pattern_id) return null;
        let pc = require('../index').patterns;
        return pc.cache.get(this.pattern_id) || await pc.fetch(this.pattern_id);
    }  

    /**
     * Returns whether or not the data of this class is equal to the {@link Vehicle} supplied.
     * @example 
     * vehicle.isEqual(vehicle2)
     * @constructor
     * @returns {Boolean}
     */
    isEqual(other) {
        return this.stop_id === other.stop_id && this.lat === other.lat && this.lon === other.lon && this.speed === other.speed
    }

    /**
     * Returns an object equivelent of this object.
     * @example 
     * return vehicle.info()
     * @constructor
     * @returns {Object}
     */
    info() {
        return {id: this.id, stop_id: this.stop_id, lat: this.lat, lon: this.lon, trip_id: this.trip_id, speed: this.speed, pattern_id: this.pattern_id}
    }

    /**
    * @param {"serviceStart" | "serviceEnd" | "vehicleUpdate" | "positionUpdate"} event - The event to listen for. Possible values: 'serviceStart', 'serviceEnd', 'vehicleUpdate', 'positionUpdate'.
    * @param {Function} listener - The function to call when the event is emitted.
    * @returns {this}
    */
    on(event, listener) {
        return super.on(event, listener);
    }
}

module.exports = Vehicle;