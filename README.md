## About
CMetropolitana.js is an unofficial [Node.js](https://nodejs.org) API wrapper for [Carris Metropolitana](https://github.com/carrismetropolitana/api)'s public api. 
With this wrapper, you can interact with all of the existing API endpoints, as well as listen to specific events (such as when a vehicle arrives/departs a bus stop...)

## Instalation
```sh
npm install cmetropolitana.js
yarn add cmetropolitana.js
```

## Example usage

Feel free to also check the suplied [example.js](https://github.com/Movs22/CMetropolitana.js/blob/main/example.js) file for further details! This package also includes JSDocs (which should work with any existing IDE).

Installation:
```sh
npm install cmetropolitana.js
yarn add cmetropolitana.js
```

Fetch details for a specific stop by its ID:
```js
const CMetropolitana = require("cmetropolitana.js")

CMetropolitana.stops.fetch("060033").then(stop => {
    console.log(stop.name); // Marquês de Pombal (Metro) P1
    console.log(stop.patterns); // Array of service patterns serving this stop.
    console.log(stop.alerts()); // Array of any (cached) alerts for this stop.
})
```

Fetch details for a specific vehicle by its ID:
```js
const CMetropolitana = require("cmetropolitana.js")

CMetropolitana.vehicles.fetch("41|1100").then(vehicle => {
    console.log(vehicle); // Vehicle { id: '41|1100', (...) }
    vehicle.parent().then(pattern => { // vehicle.parent() will return this vehicle's pattern_id.
        console.log(pattern) // Pattern { id: '1001_0_1', (...) }
    })
})
```
Afterwards, we can listen to specific events:
```js
const CMetropolitana = require("cmetropolitana.js")

const vehicle = CMetropolitana.vehicles.cache.get("41|1100") // Keep in mind that this will return null unless you've fetched this vehicle beforehand.

// Event: Triggered whenever this vehicle's position gets updated
vehicle.on("positionUpdate", (lat, lon) => {
    console.log(`New position for ${vehicle.id}: ${lat}, ${lon}`)
})

// Event: Triggered whenever this vehicle starts a new service
vehicle.on("serviceStart", () => {
    console.log(`${vehicle.id} has started a new service!`)
})
// OR
CMetropolitana.vehicles.on("serviceStart", (vec) => {
    console.log(`${vec.id} has started a new service!`)
})

// Event: Triggered whenever this vehicle finishes a service
vehicle.on("serviceEnd", () => {
    console.log(`${vehicle.id} has finished a service!`)
})
// OR
CMetropolitana.vehicles.on("serviceEnd", (vec) => {
    console.log(`${vec.id} has finished a service!`)
})
```


Get the line/route from a pattern, using .parent():
```js
const CMetropolitana = require("cmetropolitana.js")

CMetropolitana.patterns.fetch("1001_0_1").then(async pattern => {
    let route = await pattern.pattern(); // Route { id: "1001_0", (...) }
    let line = await route.parent(); // Line { id: "1001", (...) }
})
```
Or, you can get all lines/routes/patterns on a specific line, route or stop:
```js
const CMetropolitana = require("cmetropolitana.js")

CMetropolitana.lines.fetch("1001").then(async line => {
    let routes = await line.getRoutes(); // [ Route { id: "1001_0", (...) }, (...) ]
    let patterns = await line.getPatterns(); // [ Pattern { id: "1001_0_1", (...) }, (...) ]
})

CMetropolitana.routes.fetch("1001_0").then(async route => {
    let patterns = await route.getPatterns(); // [ Pattern { id: "1001_0_1", (...) }, (...) ]
})

CMetropolitana.stops.fetch("121270").then(async stop => {
    let lines = await stop.getLines(); // [ Line { id: "1120", (...) }, (...) ]
    let routes = await stop.getRoutes(); // [ Route { id: "1120_0", (...) }, (...) ]
    let patterns = await stop.getPatterns(); // [ Pattern { id: "1120_0_2", (...) }, (...) ]
})
```

Get info of a specific school:
```js
const CMetropolitana = require("cmetropolitana.js")

CMetropolitana.schools.fetch("200098").then(school => {
    console.log(school.name); // School name
    console.log(school.stops); // Returns an array with nearby stops (as strings).
    school.getStops().then(stops => console.log(stops)) // Same as school.stops, but returns Stop classes instead of strings: [ Stop { id: "070401", (...) }, (...) ]
})
```

Get existing alerts:
```js
const CMetropolitana = require("cmetropolitana.js")

async function load() {
    CMetropolitana.alerts.fetchAll(); // Fetches all alerts
    CMetropolitana.routes.fetchAll(); // Fetches all routes (you can also do CMetropolitana.routes.fetch("XXXX_X").then(route => {}) )
    CMetropolitana.stops.fetchAll(); // Fetches all stops (you can also do CMetropolitana.stops.fetch("XXXXXX").then(route => {}) )
}

CMetropolitana.alerts.forStop("060006"); // Returns an array with all cached alerts for the given stop (or an empty array if there're none).
// OR
CMetropolitana.stops.cache.get("060006").alerts();

CMetropolitana.alerts.forRoute("1001_0"); // Returns an array with all cached alerts for the given route (or an empty array if there're none).
// OR
CMetropolitana.routes.cache.get("1001_0").alerts();
```

Get details for a vehicle that's already cached by its ID
```js
const CMetropolitana = require("cmetropolitana.js")

console.log(CMetropolitana.vehicles.cache.get("41|1100")) // Vehicle { id: '41|1100', (...) }
```

Get departures for a specific stop
```js
const CMetropolitana = require("cmetropolitana.js")

const stop = CMetropolitana.stops.cache.get("060033") // Keep in mind that this will return null unless you've fetched this stop beforehand.\

stop.departures().then(departures => {
    departures.forEach(async d => {
        console.log(d) // [ {estimated_arrival: null, (...) }, (...) ]
        console.log(await d.getVehicle()) // Vehicle { id: 'XX|XXXX', (...) }
    })
})
```

You can also listen to specific events:
```js
const CMetropolitana = require("cmetropolitana.js")

const stop = CMetropolitana.stops.cache.get("060033") // Keep in mind that this will return null unless you've fetched this stop beforehand.\

// Event: Triggered whenever a vehicle arrives at this stop.
stop.on("vehicleArrival", (vec) => {
    console.log(`${vec.id} has arrived at ${stop.name}`)
})

// Event: Triggered whenever a vehicle departs from this stop.
stop.on("vehicleDeparture", (vec) => {
    console.log(`${vec.id} has departed fromm ${stop.name}`)
})
```

If necessary, you can fetch all of the stops, lines and routes beforehand:
```js
const CMetropolitana = require("cmetropolitana.js")

async function load() {
    await CMetropolitana.lines.fetchAll()
    await CMetropolitana.routes.fetchAll()
    await CMetropolitana.stops.fetchAll()
    await CMetropolitana.alerts.fetchAll()
    await CMetropolitana.schools.fetchAll()
}

load()
```
