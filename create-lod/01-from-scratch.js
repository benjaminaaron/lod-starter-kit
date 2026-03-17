import { addTriple, newStore, storeToTurtle } from "@foerderfunke/sem-ops-utils"
import { expand, prefixes } from "../utils.js"

let store = newStore()

addTriple(store,
    expand("oddmuc26"),
    expand("rdf", "type"),
    expand("schema", "Event")
)

addTriple(store,
    expand("oddmuc26"),
    expand("schema", "name"),
    "Open Data Day München 2026"
)

addTriple(store,
    expand("oddmuc26"),
    expand("hasDate"),
    "2026-03-21"
)

addTriple(store,
    expand("oddmuc26"),
    expand("hasSession"),
    expand("lodPotential")
)

addTriple(store,
    expand("lodPotential"),
    expand("schema", "name"),
    "Potenziale von Linked Open Data entdecken"
)

let turtle = await storeToTurtle(store, prefixes)
console.log(turtle)
