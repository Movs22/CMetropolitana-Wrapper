## About
CMetropolitana.js is an unofficial [Node.js](https://nodejs.org) API wrapper for [Carris Metropolitana](https://github.com/carrismetropolitana/api)'s public api. 
With this wrapper, you can interact with all of the existing API endpoints, as well as listen to specific events (such as when a vehicle arrives/departs a bus stop...)

## Instalation
```sh
npm install cmetropolitana.js
yarn add cmetropolitana.js
```

## Example usage

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
})
```

Fetch details for a specific vehicle by its ID:
```js
const CMetropolitana = require("cmetropolitana.js")

CMetropolitana.vehicles.fetch("41|1100").then(vehicle => {
    console.log(vehicle); // Vehicle { id: '41|1100', (...) }
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

stop.on("vehicleArrival", (vec) => {
    console.log(`${vec.id} has arrived at ${stop.name}`)
})

stop.on("vehicleDeparture", (vec) => {
    console.log(`${vec.id} has departed fromm ${stop.name}`)
})
```
