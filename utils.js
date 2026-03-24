import { storeFromTurtles, storeToTurtle } from "@foerderfunke/sem-ops-utils"
import proj4 from "proj4"
import fs from "fs"

export const prefixes = {
    odd: "https://open.bydata.de/oddmuc26#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    csvw: "http://www.w3.org/ns/csvw#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    schema: "https://schema.org/",
    geo: "http://www.w3.org/2003/01/geo/wgs84_pos#",
    osmnode: "https://www.openstreetmap.org/node/",
    osmway: "https://www.openstreetmap.org/way/"
}

export const expand = (prefix, localName) => {
    // if only one arg --> use odd-prefix
    if (!localName) return `${prefixes.odd}${prefix}`
    return `${prefixes[prefix]}${localName}`
}

export async function transformEPSG25832ToWGS84(shapeStr) {
    proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs")
    const coords = shapeStr.split("(")[1].split(")")[0].split(" ")
    let easting = Number(coords[0])
    let northing = Number(coords[1])
    const [lon, lat] = proj4("EPSG:25832", "WGS84", [easting, northing])
    return { lat, lon }
}

export async function convertNTriplesToTurtle(nTriplesFile) {
    let store = storeFromTurtles([fs.readFileSync(nTriplesFile, { encoding: "utf8" })])
    return await storeToTurtle(store, prefixes)
}
