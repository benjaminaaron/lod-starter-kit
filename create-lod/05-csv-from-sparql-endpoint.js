import { addTriple, newStore, storeToTurtle } from "@foerderfunke/sem-ops-utils"
import { expand, prefixes, transformEPSG25832ToWGS84 } from "../utils.js"
import { QueryEngine } from "@comunica/query-sparql"
import { fileURLToPath } from "url"
import Papa from "papaparse"
import path from "path"
import fs from "fs"

const ENDPOINT = "https://open.bydata.de/api/sparql"
const engine = new QueryEngine()
const OUTPUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "output")

let query = `
    PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX filetype: <http://publications.europa.eu/resource/authority/file-type/>
    SELECT ?url WHERE {
        ?ds a dcat:Dataset ;
            dct:title ?title ;
            dcat:distribution ?dist .
        FILTER (STRSTARTS(?title, "WC-Standorte der Landeshauptstadt München"))
        ?dist dct:format filetype:CSV ;
            dcat:accessURL ?url .
    }`
const bindingsStream = await engine.queryBindings(query, { sources: [ENDPOINT] })
const bindings = await bindingsStream.toArray()
let count = 0
for (let binding of bindings) {
    let url = binding.get("url").value
    const res = await fetch(url)
    const text = await res.text()
    let filename = `wc-standorte-${++ count}`
    let file = path.join(OUTPUT_DIR, filename + ".csv")
    fs.writeFileSync(file, text, "utf8")
    console.log(`Wrote ${file}`)

    let store = newStore()
    const csv = Papa.parse(text, { header: true, skipEmptyLines: true })
    for (let row of csv.data) {
        let id = expand(row["FID"])
        addTriple(store, id, expand("rdf", "type"), expand("schema", "PublicToilet"))
        addTriple(store, id, expand("rdfs", "title"), row["name"])
        let shape = row["shape"]
        let { lat, lon } = await transformEPSG25832ToWGS84(shape)
        addTriple(store, id, expand("geo", "lat"), lat)
        addTriple(store, id, expand("geo", "long"), lon)
    }
    let turtle = await storeToTurtle(store, prefixes)
    file = path.join(OUTPUT_DIR, filename + ".ttl")
    fs.writeFileSync(file, turtle, "utf8")
    console.log(`Wrote ${file}`)
}
