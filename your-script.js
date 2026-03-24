import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

// example endpoint
const OPENBYDATA_ENDPOINT = "https://open.bydata.de/api/sparql"

// example local file
const THIS_DIR = path.dirname(fileURLToPath(import.meta.url))
const TTL_FILE = path.join(THIS_DIR, "create-lod", "output", "240826-spielplaetze.ttl")
const fileContent = fs.readFileSync(TTL_FILE, { encoding: "utf8" })

// TODO have fun :)
