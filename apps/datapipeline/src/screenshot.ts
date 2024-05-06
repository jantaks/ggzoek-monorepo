import "dotenv/config.js";
import {chromium, firefox, webkit, devices} from 'playwright'
import {Vacature} from "./summarize.js";
import {closeConnection, db, getVacaturesWithoutScreenshot} from "@ggzoek/ggz-drizzle/src/vacatureRepo.js";
import {vacatures as vacatureTable} from "../../../packages/ggz-drizzle/drizzle/schema.js";
import {eq, isNull} from "drizzle-orm";

async function createScreenshots(vacatures: Vacature[]) {
    const browser = await chromium.launch({headless: true});  // Or 'firefox' or 'webkit'.
    const context = await browser.newContext(devices['iPhone 11']);
    const cookieButtonLabels = ['Alles toestaan', 'Cookies toestaan', 'Alle cookies toestaan', 'Accepteren', 'Ik ga akkoord'];

    for (const vacature of vacatures) {
        console.log(`Navigating to ${vacature.url}`)
        const page = await context.newPage();
        if (vacature.url) {
            await page.goto(vacature.url);
            for (const label of cookieButtonLabels) {
                try {
                    await page.click(`text=${label}`, {timeout: 500});
                    console.log(`Clicked cookie button with label "${label}"`);
                    break;
                } catch (error) {
                    console.log(`No cookie button found with label "${label}"`);
                }
            }
            console.log(`Creating screenshot for ${vacature.url}`)
            let file = `./screenshots/img_q50_${vacature.urlHash}.jpg`;
            await page.screenshot({path: file, type: "jpeg", quality: 50});
            const url = await uploadImage(file)
            console.log("Uploaded image to ", url)
            if (url){
                await db.update(vacatureTable)
                    .set({screenshotUrl: url})
                    .where(eq(vacatureTable.urlHash, vacature.urlHash))
                    .execute();
            }
        }
    }
    await browser.close();
}
import {v2 as cloudinary} from 'cloudinary';

// Return "https" URLs by setting secure: true
cloudinary.config({
    secure: true
});

// Log the configuration
console.log(cloudinary.config());

const uploadImage = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };

    try {
        const result = await cloudinary.uploader.upload(imagePath, options);
        return result.url;
    } catch (error) {
        console.error(error);
        return null
    }
};

// await uploadImage("./screenshots/img_q70_test.jpg")
let vacatures = await getVacaturesWithoutScreenshot()
// const vacatures = await db.select().from(vacatureTable).where(isNull(vacatureTable.screenshotUrl)).execute();
// await closeConnection()
const testUrl = "https://www.werkenbijggzfriesland.nl/vacatures/gz-psycholoog-regioteam-leeuwarden"
const vacature = {url: testUrl, urlHash: "test"}
await createScreenshots(vacatures)
await closeConnection()
