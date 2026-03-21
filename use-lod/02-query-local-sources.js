import { sparqlSelect, storeFromTurtles, storeToTurtle } from "@foerderfunke/sem-ops-utils"
import { QueryEngine } from "@comunica/query-sparql"
import { DataFactory } from "rdf-data-factory"
import haversine from "haversine-distance"
import { prefixes } from "../utils.js"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const engine = new QueryEngine()
const DF = new DataFactory()
const MAX_DIST = 200

// Use Case: Familienfreundliches München

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "create-lod", "output")
const TTL_PLAYGROUNDS = path.join(OUTPUT_DIR, "240826-spielplaetze.ttl")
const TTL_TOILETS = path.join(OUTPUT_DIR, "wc-standorte-1.ttl")
const TTL_CAFES = path.join(OUTPUT_DIR, "osm-cafes.ttl")
const OUTPUT_TTL = path.join(THIS_DIR, "output", "family-friendly-playgrounds.ttl")
const TEMPLATE_HTML = path.join(THIS_DIR, "output", "map.html.template")
const OUTPUT_HTML = path.join(THIS_DIR, "output", "map.html")

const store = storeFromTurtles([
    fs.readFileSync(TTL_PLAYGROUNDS, { encoding: "utf8" }),
    fs.readFileSync(TTL_TOILETS, { encoding: "utf8" }),
    fs.readFileSync(TTL_CAFES, { encoding: "utf8" }),
])

const calcDistanceExtension = (args) => {
    const lat1 = Number(args?.[0]?.value)
    const lon1 = Number(args?.[1]?.value)
    const lat2 = Number(args?.[2]?.value)
    const lon2 = Number(args?.[3]?.value)
    if (!Number.isFinite(lat1) || !Number.isFinite(lon1) || !Number.isFinite(lat2) || !Number.isFinite(lon2)) {
        return DF.literal("NaN", DF.namedNode("http://www.w3.org/2001/XMLSchema#double"))
    }
    const dist = haversine({ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 })
    return DF.literal(String(Math.round(dist)), DF.namedNode("http://www.w3.org/2001/XMLSchema#integer"))
}


// step 1: toilets near playgrounds

let query = `
    PREFIX odd: <https://open.bydata.de/oddmuc26#>
    PREFIX schema: <https://schema.org/>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>   
    INSERT {
        ?playground odd:hasNearbyToilet ?toilet .
    } WHERE {
        ?playground a schema:Playground ;
            geo:lat ?plat ;
            geo:long ?plon .

        ?toilet a schema:PublicToilet ;
            geo:lat ?tlat ;
            geo:long ?tlon .

        BIND(odd:calcDistance(?plat, ?plon, ?tlat, ?tlon) AS ?distPtoT) # in meters
        FILTER(?distPtoT < ${MAX_DIST})
    }`
await engine.queryVoid(query, {
    sources: [store],
    extensionFunctions: { "https://open.bydata.de/oddmuc26#calcDistance": calcDistanceExtension }
})
console.log("Query for nearby toilets done")


// step 2: cafés near playgrounds

query = `
    PREFIX odd: <https://open.bydata.de/oddmuc26#>
    PREFIX schema: <https://schema.org/>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>   
    INSERT {
        ?playground odd:hasNearbyCafe ?cafe .
    } WHERE {
        ?playground a schema:Playground ;
            geo:lat ?plat ;
            geo:long ?plon .

        ?cafe a schema:CafeOrCoffeeShop ;
            geo:lat ?clat ;
            geo:long ?clon .

        BIND(odd:calcDistance(?plat, ?plon, ?clat, ?clon) AS ?distPtoC)
        FILTER(?distPtoC < ${MAX_DIST})
    }`
await engine.queryVoid(query, {
    sources: [store],
    extensionFunctions: { "https://open.bydata.de/oddmuc26#calcDistance": calcDistanceExtension }
})
console.log("Query for nearby cafes done")

let turtle = await storeToTurtle(store, prefixes)
fs.writeFileSync(OUTPUT_TTL, turtle, "utf8")
console.log(`Wrote ${OUTPUT_TTL}`)


// step 3: extract entities meeting criteria and build map

query = `
    PREFIX odd: <https://open.bydata.de/oddmuc26#>
    PREFIX schema: <https://schema.org/>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>

    SELECT ?plat ?plon ?tlat ?tlon ?clat ?clon WHERE {
        ?playground a schema:Playground ;
            geo:lat ?plat ;
            geo:long ?plon ;
            odd:hasNearbyToilet ?toilet ;
            odd:hasNearbyCafe ?cafe .

        ?toilet geo:lat ?tlat ;
            geo:long ?tlon .

        ?cafe geo:lat ?clat ;
            geo:long ?clon .
    }`

let results = await sparqlSelect(query, [store])

let points = []
const pCol = "#ffff00"
const tCol = "#ff0000"
const cCol = "#0000ff"
for (const row of results) {
    points.push({ lat: row["plat"], lon: row["plon"], color: pCol })
    points.push({ lat: row["tlat"], lon: row["tlon"], color: tCol })
    points.push({ lat: row["clat"], lon: row["clon"], color: cCol })
}
let html = fs.readFileSync(TEMPLATE_HTML, "utf8")
html = html.replace("{{POINTS}}", JSON.stringify(points))
fs.writeFileSync(OUTPUT_HTML, html, "utf8")
console.log(`Wrote ${OUTPUT_HTML}`)
