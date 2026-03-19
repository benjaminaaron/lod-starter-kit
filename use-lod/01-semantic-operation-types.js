import { sparqlAsk, sparqlConstruct, sparqlInsertDelete, sparqlSelect, storeFromTurtles, storeToTurtle, buildValidator, datasetFromStore, datasetToTurtle } from "@foerderfunke/sem-ops-utils"
import { prefixes } from "../utils.js"

let turtle = `
    @prefix odd: <https://open.bydata.de/oddmuc26#>.
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
    @prefix schema: <https://schema.org/>.
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

    odd:oddmuc26 a schema:Event;
        odd:hasDate "2026-03-21"^^xsd:date;
        odd:hasSession 
            odd:opening, odd:keynote, odd:datengartln, odd:lodPotential ;
      schema:name "Open Data Day München 2026".

    odd:opening a odd:Session ;
        odd:room 1 ;
        schema:name "Begrüßung und Eröffnung des Open Data Day 2026". 

    odd:keynote a odd:Session ;
        odd:room 1 ;
        schema:name "Zwischen Nutzen und Risiko".

    odd:datengartln a odd:Session ;
        odd:room 1 ;
        schema:name "Preisverleihung Datengartln Challenge".

    odd:lodPotential a odd:Session ;
        odd:room 4 ;
        schema:name "Potenziale von Linked Open Data entdecken".`

let store = storeFromTurtles([turtle])


// -------------- SPARQL SELECT --------------
let query = `
    PREFIX odd: <https://open.bydata.de/oddmuc26#>
    PREFIX schema: <https://schema.org/>

    SELECT ?sessionName WHERE {
        ?session a odd:Session ;
            schema:name ?sessionName .
    }`
let results = await sparqlSelect(query, [store])
console.log("\n------- SPARQL SELECT -------\n")
console.log(results)


// -------------- SPARQL CONSTRUCT --------------
query = `
    PREFIX odd: <https://open.bydata.de/oddmuc26#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    CONSTRUCT {
        odd:oddmuc26 odd:hasSessionsPerRoom ?roomNode .
        ?roomNode odd:room ?room ;
        odd:session ?session .
    } WHERE {
        ?session odd:room ?room .
        BIND(IRI(CONCAT(STR(odd:), "sessionsInRoom", STR(?room))) AS ?roomNode)
    }`
await sparqlConstruct(query, [store], store)
console.log("\n------- SPARQL CONSTRUCT -------\n")
console.log(await storeToTurtle(store, prefixes))


// -------------- SPARQL INSERT DATA --------------
query = `
    PREFIX odd: <https://open.bydata.de/oddmuc26#>
    
    INSERT DATA {
        odd:oddmuc26 odd:hasEventLocation "IT-Referat LHM - Qubes" ;
            odd:hasSession odd:libraryOpenData .
        odd:libraryOpenData a odd:Session .
    }`
await sparqlInsertDelete(query, store)
console.log("\n------- SPARQL INSERT DATA -------\n")
console.log(await storeToTurtle(store, prefixes))


// -------------- SPARQL INSERT/DELETE --------------
query = `
    PREFIX schema: <https://schema.org/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    DELETE {
        ?something schema:name ?name .
    } INSERT {
        ?something rdfs:title ?name .
    } WHERE { 
        ?something schema:name ?name .
    }`
await sparqlInsertDelete(query, store)
console.log("\n------- SPARQL INSERT/DELETE -------\n")
console.log(await storeToTurtle(store, prefixes))


// -------------- SPARQL ASK --------------
query = `
    PREFIX odd: <https://open.bydata.de/oddmuc26#>
    ASK {
        ?event odd:hasDate ?date .
        FILTER(YEAR(?date) = 2026)
    }`
console.log("\n------- SPARQL ASK -------\n")
console.log(await sparqlAsk(query, [store]))


// -------------- SHACL --------------
let shacl = `
    @prefix odd: <https://open.bydata.de/oddmuc26#> .
    @prefix sh: <http://www.w3.org/ns/shacl#> .

    odd:sessionMustHaveRoomShape a sh:NodeShape ;
        sh:targetClass odd:Session ;
        sh:property [
            sh:path odd:room ;
            sh:minCount 1 ;
            sh:message "Each session must have a room assigned" ;
        ] .`

const validator = buildValidator(shacl)

let dataset = datasetFromStore(store)
let report = await validator.validate({ dataset })
turtle = await datasetToTurtle(report.dataset)
console.log("\n------- SHACL -------\n")
console.log(turtle)
