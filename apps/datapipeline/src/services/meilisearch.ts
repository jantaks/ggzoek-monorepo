import "dotenv/config";
import {MeiliSearch, Synonyms} from 'meilisearch'

import { Vacature } from '../ai/types.js';

const url = process.env.MEILISEARCH_URL
const key = process.env.MEILISEARCH_KEY

if (!url || !key) {
    throw new Error("Missing MEILISEARCH_URL or MEILISEARCH_KEY")
}

const FACETS = ['organisatie', 'minSalaris', 'maxSalaris', 'locaties', 'contract', 'minSchaal', 'maxSchaal', 'beroepen', 'stoornissen', 'behandelmethoden', 'minUren', 'maxUren'];

const client = new MeiliSearch({
    host: url,
    apiKey: key,
})

export async function indexVacatures(vacatures: Vacature[]) {
    const index = client.index('vacatures')
    await index.updateFilterableAttributes([...FACETS])
    return await index.addDocuments(vacatures, {primaryKey: 'urlHash'})
}

export async function updateSynonyms(synonyms: Synonyms) {
    return await client.index('vacatures').updateSynonyms(synonyms)
}

export async function getSynonyms(){
    return await client.index('vacatures').getSynonyms()
}

async function updateFilters() {
    const index = client.index('vacatures')
    return await index.updateFilterableAttributes([...FACETS])
}

async function search(query: string, filters?: string) {
    const index = client.index('vacatures')
    return await index.search(query, {facets: FACETS, filter: filters})
}

async function deleteIndex() {
    const index = client.index('vacatures')
    return await index.delete()
}

// console.log(await deleteIndex())
// console.log(await deleteIndex())
// console.log(await search("altrecht", "stoornissen = 'autisme'"))
// await updateFilters()
await getSynonyms().then(result => console.log(result))