const { API_BASE, f } = require("../constants");
const ApiError = require("../Errors/ApiError");
const CacheManager = require("./CacheManager");

const Alert = require("../Classes/Alert")

class AlertManager {
    /**
     * Creates an AlertManager.
     * @example 
     * #CMetropolitana.alerts = new AlertManager()
     * @constructor
     */
    constructor() {
        this.cache = new CacheManager();
        this.__stops = {};
        this.__routes = {};
    }

    /**
     * Gets all (cached) alerts for a given stop.
     * @example 
     * await alerts.forStop('060000')
     * @param {string} id
     * @returns {Array<Alert>}
     */
    forStop(id) {
        return this.__stops[id] || []
    }

    /**
     * Gets all (cached) alerts for a given route.
     * @example 
     * await alerts.forRoute('1001_0')
     * @param {string} id
     * @returns {Array<Alert>}
     */
    forRoute(id) {
        return this.__routes[id] || []
    }

    /**
     * Fetches all alerts and caches them.
     * @example 
     * await alerts.fetchAll()
     */
    async fetchAll() {
        let alert;
        let stops = f(API_BASE + "alerts").then(r => {
            if(r.ok) return r.json(); 
            throw new ApiError("Failed to fetch info for ALL alerts.\nReceived status code " + r.status + " " + r.statusText)
        }).then(s2 => {
            s2 = s2.entity;
            return s2.map(s => {
                alert = new Alert(s.id, s);
                s.alert.informedEntity.forEach(a => {
                    if(a.routeId) this.__routes[a.routeId] ? this.__routes[a.routeId].push(alert) : this.__routes[a.routeId] = [alert]
                    else this.__stops[a.stopId] ? this.__stops[a.stopId].push(alert) : this.__stops[a.stopId] = [alert]
                })
                this.cache.__set(s.id, alert);
            })
        })
        return stops;
    }
}

module.exports = AlertManager;