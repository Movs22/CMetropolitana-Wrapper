const { API_BASE, f } = require("../constants");
const ApiError = require("../Errors/ApiError");
const ValidationError = require("../Errors/ValidationError");
const CacheManager = require("./CacheManager");

const Route = require("../Classes/Route")

class RouteManager {
    /**
     * Creates a RouteManager, responsible for handling this package's bus routes.
     * @example 
     * #CMetropolitana.routes = new RouteManager()
     * @constructor
     */
    constructor() {
        this.cache = new CacheManager();
    }

    /**
     * Fetches a route from its ID.
     * @example 
     * await routes.fetch('1000_0')
     * @param {string} id
     * @returns {Promise<Route>}
     */
    async fetch(id) {
        if(id.length !== 6 || id[4] !== "_") throw new ValidationError("Invalid ID provided. Expected length 6 with the following format: XXXX_X. Received length " + id.length + " and ID " + id)
        let route = f(API_BASE + "routes/" + id).then(r => {
            if(r.ok) return r.json(); 
            throw new ApiError("Failed to fetch info for route #" + id + "\nReceived status code " + r.status + " " + r.statusText)
        }).then(r => {
            route = new Route(id, r);
            return route;
        })
        this.cache.__set(id, route);
        return await route;
    }

    /**
     * Fetches all routes and caches them.
     * @example 
     * await routes.fetchAll()
     */
    async fetchAll() {
        let route;
        let routes = f(API_BASE + "routes").then(r => {
            if(r.ok) return r.json(); 
            throw new ApiError("Failed to fetch info for ALL routes.\nReceived status code " + r.status + " " + r.statusText)
        }).then(r2 => {
            return r2.map(r => {
                route = new Route(r.id, r);
                this.cache.__set(r.id, route);
                return route;
            })
        })
        return routes;
    }
}

module.exports = RouteManager;