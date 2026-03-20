import { QueryEngine } from "@comunica/query-sparql-file"
import { fileURLToPath } from "url"
import path from "path"

const OPENBYDATA_ENDPOINT = "https://open.bydata.de/api/sparql"
const THIS_DIR = path.dirname(fileURLToPath(import.meta.url))
const LOCAL_TTL = path.join(THIS_DIR, "..", "create-lod", "output", "240826-spielplaetze.ttl")
// distribution of the playgrounds dataset
const REMOTE_TTL = "https://open.bydata.de/api/hub/repo/distributions/4808588b-a630-4c71-a1af-814707c52e79.ttl"

const engine = new QueryEngine()

// query combined local and remote turtle files

let query = `
    PREFIX schema: <https://schema.org/>
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT ?playgrounds ?modified WHERE {
        {
            SELECT (COUNT(?playground) AS ?playgrounds) WHERE {
                ?playground a schema:Playground .
            }
        }
        ?distribution dct:modified ?modified .
    }`
const bindingsStream = await engine.queryBindings(query, {
    sources: [
        { type: "file", value: LOCAL_TTL },
        { type: "file", value: REMOTE_TTL },
        // { type: "sparql", value: OPENBYDATA_ENDPOINT }
    ]
})
let rows = await bindingsStream.toArray()
console.log(`playgrounds: ${rows?.[0]?.get("playgrounds")?.value}, distribution last modified: ${rows?.[0]?.get("modified")?.value}`)
