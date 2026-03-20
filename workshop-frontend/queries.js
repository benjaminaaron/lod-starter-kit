export const queries = {
// -------------------------------------------------------------------
    listNamedGraphsWithTripleCount: `
SELECT ?graph (COUNT(*) AS ?triples) WHERE {
    GRAPH ?graph { ?s ?p ?o }
}
GROUP BY ?graph
ORDER BY DESC(?triples)`,
// -------------------------------------------------------------------
    listTriplesInSpecificGraph: `
SELECT ?s ?p ?o WHERE {
    GRAPH <https://open.bydata.de/oddmuc26#workshop_exampleGraph> { 
        ?s ?p ?o
    }
} LIMIT 10`,
// -------------------------------------------------------------------
    listTriplesInSetOfGraphs: `
PREFIX odd: <https://open.bydata.de/oddmuc26#>

SELECT ?g ?s ?p ?o WHERE {
    VALUES ?g {
        odd:workshop_exampleGraph1
        odd:workshop_exampleGraph2
    } 
    GRAPH ?g {
        ?s ?p ?o
    }
} LIMIT 10`,
// -------------------------------------------------------------------
    joinGraphsBySharedObject: `
PREFIX odd: <https://open.bydata.de/oddmuc26#>

SELECT ?s1 ?p1 ?o ?p2 ?o2 WHERE {
    GRAPH odd:workshop_exampleGraph1 {
        ?s1 ?p1 ?o .
    }
    GRAPH odd:workshop_exampleGraph2 {
        ?o ?p2 ?o2 .
    }
} LIMIT 10`
// -------------------------------------------------------------------
}
