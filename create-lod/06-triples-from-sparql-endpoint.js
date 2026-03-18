import { newStore, storeToTurtle } from "@foerderfunke/sem-ops-utils"
import { QueryEngine } from "@comunica/query-sparql"
import { prefixes} from "../utils.js"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const OSM_ENDPOINT = "https://qlever.dev/api/osm-planet"
const OUTPUT_TTL = path.join(path.dirname(fileURLToPath(import.meta.url)), "output", "osm-cafes.ttl")
const engine = new QueryEngine()

let query = `
    PREFIX ogc: <http://www.opengis.net/rdf#>
    PREFIX geog: <http://www.opengis.net/ont/geosparql#>
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX osmkey: <https://www.openstreetmap.org/wiki/Key:>
    PREFIX osmrel: <https://www.openstreetmap.org/relation/>
    PREFIX schema: <https://schema.org/>
    CONSTRUCT {
        ?cafe a schema:CafeOrCoffeeShop ;
            schema:name ?name ;
            geo:lat ?lat ;
            geo:long ?lon .
    } WHERE {
        osmrel:62428 ogc:sfContains ?cafe .
        ?cafe osmkey:amenity "cafe" ;
            geog:hasGeometry/geog:asWKT ?wkt .
        OPTIONAL { ?cafe osmkey:name ?name }
        BIND(geof:centroid(?wkt) AS ?pt)
        BIND(geof:latitude(?pt) AS ?lat)
        BIND(geof:longitude(?pt) AS ?lon)
    }`
const quadStream = await engine.queryQuads(query, { sources: [{ type: "sparql", value: OSM_ENDPOINT }] })
let store = newStore()
for await (const q of quadStream) store.addQuad(q)

let turtle = await storeToTurtle(store, prefixes)
fs.writeFileSync(OUTPUT_TTL, turtle, "utf8")
