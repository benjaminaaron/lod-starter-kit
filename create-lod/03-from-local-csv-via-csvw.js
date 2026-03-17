import { datasetToTurtle, getRdf } from "@foerderfunke/sem-ops-utils"
import CsvwParser from "rdf-parser-csvw"
import { prefixes } from "../utils.js"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const INPUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "input")
const CSV_FILE = path.join(INPUT_DIR, "events.csv")
const CSVW_PLAIN_FILE = path.join(INPUT_DIR, "events.csv-metadata-plain.json")
const CSVW_FILE = path.join(INPUT_DIR, "events.csv-metadata.json")

async function csvToRdf(csvwFile) {
    const parser = new CsvwParser({
        factory: getRdf(),
        baseIRI: "https://open.bydata.de/oddmuc2026",
        metadata: await getRdf().io.dataset.fromURL(csvwFile)
    })
    let inputStream = fs.createReadStream(CSV_FILE, { encoding: "utf8" })
    const outputDataset = getRdf().dataset()
    await outputDataset.import(parser.import(inputStream))

    let turtle = await datasetToTurtle(outputDataset, prefixes)
    console.log(turtle)
}

await csvToRdf(CSVW_PLAIN_FILE)
await csvToRdf(CSVW_FILE)
