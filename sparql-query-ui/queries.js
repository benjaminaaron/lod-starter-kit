export const queries = {
// -------------------------------------------------------------------
    fromDistributionToDataset: `
PREFIX dcat: <http://www.w3.org/ns/dcat#>

SELECT * WHERE { 
  	?dataset a dcat:Dataset ;
        dcat:distribution <https://open.bydata.de/api/hub/repo/distributions/4808588b-a630-4c71-a1af-814707c52e79> .
}`,
// -------------------------------------------------------------------
    countTotalDatasets: `
PREFIX dcat: <http://www.w3.org/ns/dcat#>

SELECT (COUNT(?dataset) as ?count) WHERE {
	?dataset a dcat:Dataset .
}`,
// -------------------------------------------------------------------
    distinctDistributionFormats: `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct: <http://purl.org/dc/terms/>

SELECT DISTINCT ?format WHERE {
	?dataset a dcat:Dataset ;
  	dcat:distribution ?distribution .
  	?distribution dct:format ?format .
}`,
// -------------------------------------------------------------------
    datasetsWithLodDistributions: `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX filetype: <http://publications.europa.eu/resource/authority/file-type/>

SELECT DISTINCT ?catalogTitle ?datasetTitle WHERE { 
	?cat a dcat:Catalog ;
  		dct:title ?catalogTitle ;
  		dcat:dataset ?dataset .
  	?dataset a dcat:Dataset ;
  		dct:title ?datasetTitle ;
  		dcat:distribution ?distribution .
  	?distribution dct:format ?format .
  	VALUES ?format { filetype:JSON_LD filetype:JSONLD filetype:RDFXML filetype:TURTLE filetype:N3 }
}`
}
