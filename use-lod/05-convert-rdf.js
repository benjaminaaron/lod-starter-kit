import { sparqlSelect, storeFromTurtles, storeToJsonLdObj } from "@foerderfunke/sem-ops-utils"

let turtle = `
    @prefix odd: <https://open.bydata.de/oddmuc26#>.
    @prefix schema: <https://schema.org/>.

    odd:oddmuc26 a schema:Event ;
        odd:hasSession odd:opening, odd:keynote .
    odd:opening a odd:Session ;
        schema:name "Begrüßung und Eröffnung des Open Data Day 2026" .
    odd:keynote a odd:Session ;
        schema:name "Zwischen Nutzen und Risiko" .`

let store = storeFromTurtles([turtle])


// -------------- JSON-LD --------------

let jsonld = await storeToJsonLdObj(store)
console.log("\n------- JSON-LD -------\n")
console.log(jsonld)


// -------------- CSV --------------

let query = `
    PREFIX odd: <https://open.bydata.de/oddmuc26#>
    PREFIX schema: <https://schema.org/>

    SELECT ?sessionId ?sessionName WHERE {
        ?session a odd:Session ;
            schema:name ?sessionName .
        BIND(STRAFTER(?session, "#") AS ?sessionId)
    }`
let results = await sparqlSelect(query, [store])
let csv = "sessionId,sessionName\n"
csv += results.map(r => `${r["sessionId"]},${r["sessionName"]}`).join("\n")
console.log("\n------- CSV -------\n")
console.log(csv)
