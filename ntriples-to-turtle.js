import { storeFromTurtles, storeToTurtle } from "@foerderfunke/sem-ops-utils"
import { prefixes } from "./utils.js"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const filename = "file.nt"
const THIS_DIR = path.dirname(fileURLToPath(import.meta.url))
const NTRIPLES_FILE = path.join(THIS_DIR, filename)
const TTL_FILE = path.join(THIS_DIR, filename.split(".")[0] + ".ttl")

let store = storeFromTurtles([fs.readFileSync(NTRIPLES_FILE, { encoding: "utf8" })])

let turtle = await storeToTurtle(store, prefixes)
fs.writeFileSync(TTL_FILE, turtle, "utf8")
