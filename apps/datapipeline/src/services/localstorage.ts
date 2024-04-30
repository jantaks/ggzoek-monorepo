import {Dataset, Dictionary, KeyValueStore, Request} from "crawlee";
import {createHash} from "../utils.js";
import {Vacature} from "../summarize.js";
import path from "node:path";
import fs from "fs";
import fsPromises from "fs/promises";

type Data = {
    request: Request<Dictionary>
    body: string,
    title: string,
}

function store(KVS: string) {
    return async function (label: string, data: Data) {
        const updatedData: Vacature = {
            organisatie: label,
            title: data.title,
            body: data.body,
            uniqueKey: data.request.uniqueKey,
            url: data.request.loadedUrl,
            urlHash: createHash(data.request.uniqueKey),
            bodyHash: createHash(data.body),
            summary: "",
            timestamp: new Date().toISOString(),
            lastScraped: new Date().toISOString()
        }
        const dataset = await Dataset.open(label)
        await dataset.pushData(updatedData)
        await dataset.exportToJSON(label, {toKVS: KVS})
    }
}

async function getVacaturesFromKVS(kvsName: string = "json_files") {
    const store = await KeyValueStore.open(kvsName);
    let vacatures: Vacature[] = [];
    await store.forEachKey(async (key) => {
        const value = await store.getValue(key) as Vacature;
        vacatures = vacatures.concat(value);
    })
    return vacatures;
}

async function getCompletedVacatures(){
    const dirPath = path.join(process.cwd(), '/storage/completions');
    const files = await fsPromises.readdir(dirPath);
    const vacatures: Vacature[] = [];
    for (const file of files){
        const filePath = path.join(dirPath, file);
        const fileContents = await fsPromises.readFile(filePath, 'utf-8');
        const vacature = JSON.parse(fileContents);
        vacatures.push(vacature);
    }
    return vacatures;
}

async function storeCompletions(vacature: Vacature) {
    const vacatureJson = JSON.stringify(vacature, null, 2);
    const dirPath = path.join(process.cwd(), '/storage/completions');
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true});
    }
    const outputPath = path.join(dirPath, `${vacature.organisatie}_${vacature?.urlHash}.json`);
    await fsPromises.writeFile(outputPath, vacatureJson);
}

async function storeAllCompletions(vacatures: Vacature[]){
    for (const vacature of vacatures){
        await storeCompletions(vacature);
    }
}

export const localstorage = {
    getVacaturesFromKVS,
    getCompletedVacatures,
    storeAllCompletions: storeAllCompletions,
    saveData: store("json_files")
}
