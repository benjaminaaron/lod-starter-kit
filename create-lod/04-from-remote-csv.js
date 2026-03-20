import { addTriple, newStore, storeToTurtle } from "@foerderfunke/sem-ops-utils"
import { expand, prefixes } from "../utils.js"
import { fileURLToPath } from "url"
import Papa from "papaparse"
import path from "path"
import fs from "fs"

// https://open.bydata.de/datasets/0760ce3a-fef8-43e4-888f-8cc92fdf56de?locale=de
const CSV_URL = "https://opendata.muenchen.de/dataset/0760ce3a-fef8-43e4-888f-8cc92fdf56de/resource/845ce3bd-ea80-4623-b51d-a30680175c22/download/240826-spielplaetze.csv"
const OUTPUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "output")

const res = await fetch(CSV_URL)
const text = await res.text()

// write to file
let file = path.join(OUTPUT_DIR, "240826-spielplaetze.csv")
fs.writeFileSync(file, text, "utf8")

const csv = Papa.parse(text, { header: true, skipEmptyLines: true })
let store = newStore()

for (let row of csv.data) {
    if (!row["Altersgruppe"].toLowerCase().includes("kleinkinder")) continue
    let id = expand(row["ADDRESS.ID"])
    addTriple(store, id, expand("rdf", "type"), expand("schema", "Playground"))
    addTriple(store, id, expand("rdfs", "title"), row["ADDRESS.Bezeichnung"])
    addTriple(store, id, expand("geo", "lat"), row["ADDRESS.Lat"])
    addTriple(store, id, expand("geo", "long"), row["ADDRESS.Lon"])
}

let turtle = await storeToTurtle(store, prefixes)
console.log(turtle)

// write to file
file = path.join(OUTPUT_DIR, "240826-spielplaetze.ttl")
fs.writeFileSync(file, turtle, "utf8")
