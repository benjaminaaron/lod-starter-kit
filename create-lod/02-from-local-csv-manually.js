import { addTriple, newStore, storeToTurtle } from "@foerderfunke/sem-ops-utils"
import { expand, prefixes } from "../utils.js"
import { fileURLToPath } from "url"
import Papa from "papaparse"
import path from "path"
import fs from "fs"

const CSV_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "input", "events.csv")
const csv = Papa.parse(fs.readFileSync(CSV_FILE, "utf8"), { header: true, skipEmptyLines: true })
let store = newStore()

for (let row of csv.data) {
    addTriple(store, expand(row.id), expand("rdf", "type"), expand("schema", "Event"))
    addTriple(store, expand(row.id), expand("rdfs", "title"), row.title)
    addTriple(store, expand(row.id), expand("schema", "startDate"), row.event_date)
    addTriple(store, expand(row.id), expand("schema", "price"), row.ticket_price)
    addTriple(store, expand(row.id), expand("schema", "maximumAttendeeCapacity"), row.max_attendees)
    addTriple(store, expand(row.id), expand("schema", "eventAttendanceMode"), row.attendance_mode)
}

let turtle = await storeToTurtle(store, prefixes)
console.log(turtle)
