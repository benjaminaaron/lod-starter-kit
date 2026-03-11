
export const prefixes = {
    dev: "https://open.bydata.de/oddmuc2026#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    csvw: "http://www.w3.org/ns/csvw#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    schema: "https://schema.org/",
}

export const expand = (prefix, localName) => {
    // if only one arg --> use dev-prefix
    if (!localName) return `${prefixes.dev}${prefix}`
    return `${prefixes[prefix]}${localName}`
}
