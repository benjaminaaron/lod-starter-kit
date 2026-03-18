import { fileURLToPath } from "url"
import path from "path"

const OUTPUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "create-lod", "output")
const INPUT_TTL_PLAYGROUNDS = path.join(OUTPUT_DIR, "240826-spielplaetze.ttl")
const INPUT_TTL_TOILETS = path.join(OUTPUT_DIR, "wc-standorte-1.ttl")
const INPUT_TTL_CAFES = path.join(OUTPUT_DIR, "osm-cafes.ttl")
