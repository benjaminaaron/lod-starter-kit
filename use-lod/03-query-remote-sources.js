import { QueryEngine } from "@comunica/query-sparql"

// reverse proxy for https://odd.bydata.de/sparql
const WORKSHOP_TRIPLESTORE_ENDPOINT = "https://oddmuc26-workshop-proxy.benjamin-degenhart.workers.dev/sparql"
const OPENBYDATA_ENDPOINT = "https://open.bydata.de/api/sparql"
const engine = new QueryEngine()

let query = `
    PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT * WHERE {
        <https://open.bydata.de/api/hub/repo/catalogues/muenchen> dcat:dataset ?dataset .
        ?dataset a dcat:Dataset ;
            dct:title ?title .
    } LIMIT 10`

const bindingsStream = await engine.queryBindings(query, { sources: [OPENBYDATA_ENDPOINT] })
let rows = await bindingsStream.toArray()
for (const row of rows) {
    for (const key of row.keys()) {
        const term = row.get(key)
        console.log(`${key.value}: ${term.value}`)
    }
    console.log("----")
}
