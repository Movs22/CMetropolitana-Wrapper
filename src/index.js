const StopManager = require("./Managers/StopManager");
const RouteManager = require("./Managers/RouteManager");
const LineManager = require("./Managers/LineManager");
const PatternManager = require("./Managers/PatternManager");
const VehicleManager = require("./Managers/VehicleManager");

const ENCMManager = require("./Managers/ENCMManager");
const SchoolManager = require("./Managers/SchoolManager");
const AlertsManager = require("./Managers/AlertsManager");

module.exports.stops = new StopManager()
module.exports.routes = new RouteManager()
module.exports.lines = new LineManager()
module.exports.patterns = new PatternManager()
module.exports.vehicles = new VehicleManager()
module.exports.encms = new ENCMManager()
module.exports.schools = new SchoolManager()
module.exports.alerts = new AlertsManager()