import { synonyms } from "./synonyms.js";
import {create} from "node:domain";
import {updateSynonyms} from "./services/meilisearch.js";
type Synonyms = { [key: string]: string[] };

function createMutualAssociations(synonyms: Synonyms): Synonyms {
    const mutualAssociations: Synonyms = {};

    // Step 1: Direct associations
    Object.keys(synonyms).forEach(key => {
        mutualAssociations[key] = synonyms[key];
    });

    // Step 2: Mutual associations
    Object.entries(synonyms).forEach(([key, values]) => {
        values.forEach(value => {
            // Initialize the array if it does not exist
            if (!mutualAssociations[value]) {
                mutualAssociations[value] = [];
            }

            // Add the original key and other synonyms, avoiding duplicates
            mutualAssociations[value] = Array.from(new Set([...mutualAssociations[value], key, ...values.filter(val => val !== value)]));
        });
    });

    return mutualAssociations;
}


Object.keys(synonyms).forEach(key => {
    console.log(key);
    updateSynonyms(createMutualAssociations(synonyms[key])).then(result => console.log(result));
})
