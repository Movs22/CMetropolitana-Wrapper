const StopManager = require("./Managers/StopManager");
const RouteManager = require("./Managers/RouteManager");
const LineManager = require("./Managers/LineManager");
const PatternManager = require("./Managers/PatternManager");
const VehicleManager = require("./Managers/VehicleManager");

module.exports.stops = new StopManager()
module.exports.routes = new RouteManager()
module.exports.lines = new LineManager()
module.exports.patterns = new PatternManager()
module.exports.vehicles = new VehicleManager()