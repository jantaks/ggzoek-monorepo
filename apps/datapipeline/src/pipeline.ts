import { runCrawlers } from './scrape.js';
import { storage } from './services/storage.js';
import {
    getUnsyncedVacatures,
    getUpdatedVacatures,
    getVacaturesToSummarize,
    upsertVacature
} from '@ggzoek/ggz-drizzle/src/vacatureRepo.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { indexVacatures } from './services/meilisearch.js';
import { correctSpelling } from './synonyms.js';
import { Vacature } from './ai/types.js';
import { Provider, summarizeVacatures } from './ai/summarize.js';
import { MinimumVacature } from '@ggzoek/ggz-drizzle/drizzle/schema.js';


async function step_1(){
    log.info("Running crawlers")
    await runCrawlers()
}

async function step_2(){
    log.info("Save to database")
    const scraped = await storage.getVacaturesFromKVS()
    log.info(`Found ${scraped.length} scraped vacatures`)
    const updated = await getUpdatedVacatures(scraped)
    log.debug(`Found ${updated.length} updated vacatures`)
    for (const vacature of updated){
        log.info(`Storing vacature ${vacature.url}`)
        await upsertVacature(vacature)
    }
}

const step_3 = async () => {
    log.info("Summarizing vacatures")
    const vacaturesToSummarize = await getVacaturesToSummarize() as Vacature[]
    log.info(`Found ${vacaturesToSummarize.length} vacatures to summarize`)
    const completed = await summarizeVacatures(vacaturesToSummarize, Provider.ANTHROPIC)
}

const step_4 = async () => {
    await correctSpelling()
}

const step_5 = async () => {
    log.info("Adding vacatures to search index")
    const completed = await getUnsyncedVacatures() as Vacature[]
    //TODO: set synced to true after indexing
    await indexVacatures(completed)
    for (const vacature of completed){
        log.info(`Marking ${vacature.url} as synced`)
        await upsertVacature({...vacature, synced: true})
    }
}

// await step_1()
// await step_2()
await step_3()
// await step_4()
// await step_5().then(closeConnection)



