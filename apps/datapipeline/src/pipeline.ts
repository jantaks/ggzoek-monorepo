import {runCrawlers} from "./scrape.js";
import {localstorage} from "./services/localstorage.js";
import {summarizeVacatures, Vacature} from "./summarize.js";
import {getUpdatedVacatures, upsertVacature, closeConnection, getUnsyncedVacatures} from "@ggzoek/ggz-drizzle/src/vacatureRepo.js";
import {log} from "./utils.js";
import {indexVacatures} from "./services/meilisearch.js";
import {correctSpelling} from "./synonyms.js";

async function getVacaturesToSummarize(){
    const vacatures = await localstorage.getVacaturesFromKVS()
    log.debug(`Found ${vacatures.length} scraped vacatures`)
    const updated = await getUpdatedVacatures(vacatures)
    log.debug(`Found ${updated.length} updated vacatures`)
    return updated
}

async function step_1(){
    log.info("Running crawlers")
    await runCrawlers()
}

const step_2 = async () => {
    log.info("Summarizing vacatures")
    const vacaturesToSummarize = await getVacaturesToSummarize()
    const vacatures = await summarizeVacatures(vacaturesToSummarize)
    await localstorage.storeAllCompletions(vacatures)
}

const step_3 = async () => {
    log.info("Storing summarized vacatures in db")
    const completed = await localstorage.getCompletedVacatures()
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

await step_1()
await step_2()
await step_3()
await step_4()
await step_5().then(closeConnection)


