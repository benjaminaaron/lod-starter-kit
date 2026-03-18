
let turtle = `
    @prefix odd: <https://open.bydata.de/oddmuc26#>.
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
    @prefix schema: <https://schema.org/>.
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

    odd:lodPotential
        schema:name "Potenziale von Linked Open Data entdecken".

    odd:oddmuc26 a schema:Event;
        odd:hasDate "2026-03-21"^^xsd:date;
        odd:hasSession 
            odd:lodPotential, odd:datengartln, odd:opening, odd:keynote ;
      schema:name "Open Data Day München 2026".`

// SPARQL SELECT
let query = ``

// SPARQL CONSTRUCT
query = ``

// SPARQL INSERT/DELETE
query = ``

// SHACL
let shacl = ``
