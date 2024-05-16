import {runCrawlers} from "./scrape.js";
import {storage} from "./services/storage.js";
import {summarizeVacatures, Vacature} from "./summarize.js";
import {getUpdatedVacatures, upsertVacature, getUnsyncedVacatures} from "@ggzoek/ggz-drizzle/src/vacatureRepo.js";
import {log} from "@ggzoek/logging/src/logger.js";
import {indexVacatures} from "./services/meilisearch.js";
import {correctSpelling} from "./synonyms.js";
import {getVacaturesToSummarize} from "@ggzoek/ggz-drizzle/src/vacatureRepo.js"


async function step_1(){
    log.info("Running crawlers")
    await runCrawlers()
}

async function step_1_a(){
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

const step_2 = async () => {
    log.info("Summarizing vacatures")
    const vacaturesToSummarize = await getVacaturesToSummarize()
    const vacatures = await summarizeVacatures(vacaturesToSummarize)
    await storage.storeAllCompletions(vacatures)
}

const step_3 = async () => {
    log.info("Storing summarized vacatures in db")
    const completed = await storage.getCompletedVacatures()
    for (const vacature of completed){
        log.info(`Storing vacature ${vacature.url}`)
        await upsertVacature(vacature)
    }
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
// await step_1_a()
// log.info("Step 1a done")
await step_2()
// await step_3()
// await step_4()
// await step_5().then(closeConnection)



