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
} LIMIT 10`,
// -------------------------------------------------------------------
    listPlaygroundsWithNearbyToiletsAndCafes: `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX odd: <https://open.bydata.de/oddmuc26#>
PREFIX schema: <https://schema.org/>

SELECT ?pName ?tName ?cName WHERE {
    GRAPH odd:workshop_useCase2playgrounds { 
        ?playground a schema:Playground ;
            rdfs:title ?pName ;
            odd:hasNearbyToilet ?toilet ;
            odd:hasNearbyCafe ?cafe .
      	?toilet rdfs:title ?tName .
      	?cafe schema:name ?cName .
    }
}`,
// -------------------------------------------------------------------
    wanderungssaldoIngolstadtBezirke: `
PREFIX dev: <https://open.bydata.de/api/hub/dev#>
PREFIX schema: <http://schema.org/>

SELECT
    ?bezirk
    ?bezirkName
    (ROUND(AVG(?netMigrationRatePer1000)*10)/10 AS ?avgNetMigrationRatePer1000)
WHERE {
    ?bezirk a dev:Bezirk ;
        schema:name ?bezirkName ;
        dev:hasAnnualStatistic ?s1, ?s2 .

    ?s1 a dev:CityAnnualStatistic ;
        dev:year ?y1 ;
        dev:hasPopulation ?pop1 .

    ?s2 a dev:CityAnnualStatistic ;
        dev:year ?y2 ;
        dev:hasPopulation ?pop2 ;
        dev:hasBirths ?births2 ;
        dev:hasDeaths ?deaths2 .

    FILTER(?y2 = ?y1 + 1)

    # Wanderungssaldo = Bevölkerungsänderung - (Geburten - Todesfälle)
    BIND((?pop2 - ?pop1) - (?births2 - ?deaths2) AS ?netMigration)
    # normalized rate per 1000 residents
    BIND((1000 * ?netMigration / ?pop2) AS ?netMigrationRatePer1000)
}
GROUP BY ?bezirk ?bezirkName
ORDER BY DESC(?avgNetMigrationRatePer1000)`
}
