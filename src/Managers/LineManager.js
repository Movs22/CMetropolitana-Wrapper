const { API_BASE, f } = require("../constants");
const ApiError = require("../Errors/ApiError");
const CacheManager = require("./CacheManager");

const Line = require("../Classes/Line")

class LineManager {
    /**
     * Creates a LineManager, responsible for handling this package's bus lines.
     * @example 
     * #CMetropolitana.lines = new LineManager()
     * @constructor
     */
    constructor() {
        this.cache = new CacheManager();
    }

    /**
     * Fetches a line from its ID.
     * @example 
     * await lines.fetch('1000')
     * @param {string} id
     * @returns {Promise<Line>}
     */
    async fetch(id) {
        if(id.length !== 4) throw new ValidationError("Invalid ID provided. Expected length 4. Received length " + id.length )
        let line = f(API_BASE + "lines/" + id).then(r => {
            if(r.ok) return r.json(); 
            throw new ApiError("Failed to fetch info for line #" + id + "\nReceived status code " + r.status + " " + r.statusText)
        }).then(r => {
            line = new Line(id, r);
            return line;
        })
        this.cache.__set(id, line);
        return await line;
    }

    /**
     * Fetches all lines and caches them.
     * @example 
     * await lines.fetchAll()
     */
    async fetchAll() {
        let line;
        let lines = f(API_BASE + "lines").then(r => {
            if(r.ok) return r.json(); 
            throw new ApiError("Failed to fetch info for ALL lines. \nReceived status code " + r.status + " " + r.statusText)
        }).then(l2 => {
            return l2.map(l => {
                line = new Line(l.id, l);
                this.cache.__set(l.id, line);
                return line;
            })
        })
        return lines;
    }
}

module.exports = LineManager;