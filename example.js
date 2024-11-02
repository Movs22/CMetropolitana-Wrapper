const CMetropolitana = require("./")

CMetropolitana.stops.fetch("060033").then(async stop => {
    console.log(stop.name); // Marquês de Pombal (Metro) P1
    console.log(stop.patterns); // [ '1704_0_1', '1704_0_2', '1074_1_1', '1704_1_2']

    // Runs whenever a vehicle arrives at this stop.
    stop.on("vehicleArrival", (vehicle) => {
        console.log("Vehicle " + vehicle.id + " has arrived at " + stop.name + "!")
    })

    // Runs whenever a vehicle departs this stop.
    stop.on("vehicleDeparture", (vehicle) => {
        console.log("Vehicle " + vehicle.id + " has departed from " + stop.name + "!")
    })

    // Gets this stop's departures for the day
    stop.departures().then(departures => {
        departures.forEach(async d => {
            console.log(d) // [ {estimated_arrival: null, (...) }, (...) ]
            console.log(await d.getVehicle()) // Vehicle { id: 'XX|XXXX', (...) }
        })
    })
})

CMetropolitana.vehicles.fetch("41|1100").then(vehicle => {
    
    let vehicle2 = CMetropolitana.vehicles.cache.get("41|1200") // returns null or the corresponding Vehicle if its already been cached.
    console.log(vehicle2)

    // Runs whenever this vehicle moves position (checked every 30 secs)
    vehicle.on("positionUpdate", (lat, lon) => {
        console.log("New position: " + lat + ", " + lon + ".")
    })

    // Runs whenever any field of this vehicle's info gets changed (i.e. location, next stop...)
    vehicle.on("vehicleUpdate", (oldVec, newVec) => {
        console.log("Previous stop: " + oldVec.stop_id + " | Current stop: " + newVec.stop_id) 
        // NOTE: oldVec IS NOT returned as a Vehicle but rather as an object. You should always fetch it if you need anything other than lat/lon, stop_id, trip_id or pattern_id by doing CMetropolitana.vehicles.fetch("XX|XXXX") or CMetropolitana.vehicles.cache.get("XX|XXXX")
    })
})


async function load() {
    await CMetropolitana.stops.fetchAll() // Fetches all stops and caches them

    let stop = CMetropolitana.stops.cache.get("056531")

    console.log(stop) // Stop { id: '056531', (...) }

    
    await CMetropolitana.lines.fetchAll() // Fetches all stops and caches them

    let line = CMetropolitana.lines.cache.get("1120")

    console.log(line) // Line { id: '1120', color: '#3D85C6', (...) }

}

load()