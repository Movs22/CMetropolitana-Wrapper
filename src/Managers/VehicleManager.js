const { API_BASE2, f } = require("../constants");
const ApiError = require("../Errors/ApiError");
const ValidationError = require("../Errors/ValidationError");
const CacheManager = require("./CacheManager");

const Vehicle = require("../Classes/Vehicle")

const EventEmitter = require("events")

class VehicleManager extends EventEmitter {
    /**
     * Creates a StopManager, responsible for handling this package's bus stops.
     * @example 
     * #CMetropolitana.stops = new StopManager()
     * @constructor
     */
    constructor() {
        super();
        this.cache = new CacheManager();
        this.__vehicles = {};
        this.__reqFetch = false;
        setInterval(async () => {
            if (!this.__reqFetch) return;
            let oldVec = this.__vehicles.map(a => a.info()) || [];
            let v;
            this.__vehicles = await (f(API_BASE2 + "vehicles").then(r => {
                if (r.ok) return r.json();
                throw new ApiError("Failed to fetch buses\nReceived status code " + r.status + " " + r.statusText)
            }).then(r => {
                return r.map(vec => {
                    if (this.cache.get(vec.id)) {
                        this.cache.get(vec.id).__update(vec);
                        return this.cache.get(vec.id)
                    } else {
                        v = new Vehicle(vec.id, vec)
                        this.cache.__set(vec.id, v)
                        return v;
                    }
                })
            }))
            let oldBus;
            oldVec.filter(a => !this.__vehicles.some(b => b.pattern_id === a.pattern_id && b.trip_id) && a.trip_id).forEach(vec => {
                vec = this.cache.get(vec.id);
                super.emit("serviceEnd", vec)
                vec.emit("serviceEnd", vec)
            })
            this.__vehicles.filter(a => !oldVec.some(b => b.pattern_id === a.pattern_id && b.trip_id) && a.trip_id).forEach(vec => {
                super.emit("serviceStart", vec)
                vec.emit("serviceStart", vec)
            })
            this.__vehicles.filter(a => oldVec.some(b => b.vehicle_id === a.vehicle_id) && !a.isEqual(oldVec.find(b => b.vehicle_id === a.vehicle_id && b.trip_id)) && a.trip_id).forEach(async vec => {
                oldBus = oldVec.find(b => b.id === vec.id && b.trip_id);
                super.emit("vehicleUpdate", oldBus, vec)
                vec.emit("vehicleUpdate", oldBus, vec)
                vec.emit("positionUpdate", vec.lat, vec.lon)
                if (oldBus && oldBus.stop_id !== vec.stop_id) {
                    let sc = require('../index').stops;
                    sc.cache.get(vec.stop_id) && sc.cache.get(vec.stop_id).then ? sc.cache.__set(vec.stop_id, await sc.cache.get(vec.stop_id)) : null;
                    sc.cache.get(oldBus.stop_id) && sc.cache.get(oldBus.stop_id).then ? sc.cache.__set(oldBus.stop_id, await sc.cache.get(oldBus.stop_id)) : null;
                    sc.cache.get(vec.stop_id) ? sc.cache.get(vec.stop_id).emit("vehicleArrival", vec) : null;
                    sc.cache.get(oldBus.stop_id) ? sc.cache.get(oldBus.stop_id).emit("vehicleDeparture", vec) : null;
                }
            })
        }, 30 * 1000)
    }

    /**
     * Fetches a vehicle from its ID.
     * @example 
     * await vehicles.fetch('41|1100')
     * @param {string} id
     * @returns {Promise<Vehicle>}
     */
    async fetch(id) {
        if (!id) throw new ValidationError("Please provide an ID")
        if (!id.includes("|")) throw new ValidationError("Invalid ID provided. Expected ##|XXX(XX) but received " + id.length);
        let v;
        this.__vehicles = await f(API_BASE2 + "vehicles").then(r => {
            if (r.ok) return r.json();
            throw new ApiError("Failed to fetch buses\nReceived status code " + r.status + " " + r.statusText)
        }).then(r => {
            return r.map(vec => {
                if (this.cache.get(vec.id)) {
                    this.cache.get(vec.id).__update(vec);
                    return this.cache.get(vec.id)
                } else {
                    v = new Vehicle(vec.id, vec)
                    this.cache.__set(vec.id, v)
                    return v;
                }
            })
        })
        return await this.cache.get(id);
    }

    /**
    * @param {"serviceStart" | "serviceEnd" | "vehicleUpdate"} event - The event to listen for. Possible values: 'serviceStart', 'serviceEnd', 'vehicleUpdate'.
    * @param {Function} listener - The function to call when the event is emitted.
    * @returns {this}
    */
    on(event, listener) {
        this.__reqFetch = true;
        return super.on(event, listener);
    }
}

module.exports = VehicleManager;