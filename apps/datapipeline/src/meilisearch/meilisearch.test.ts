import { describe, it } from 'vitest';
import { client, getVacaturesNearby } from './meilisearch.js';
import { bulkUpsertVacatures, upsertNew } from '@ggzoek/ggz-drizzle/src/vacatures.js';
import { Vacature } from '../ai/types.js';

// 52.06997066644755,4.300333195993115 = DEN HAAG

describe('Search on location', () => {
  it('Finds a vacature near Den Haag', async () => {
    const meters = 30000;
    const DenHaag = { lat: 52.06997066644755, lon: 4.300333195993115 };
    const result = await getVacaturesNearby(DenHaag.lat, DenHaag.lon, meters);
    result.hits.forEach((vacature) => {
      console.log(vacature.locaties);
    });
  });
});

describe('get summaries from index', async () => {
  it('get all', async () => {
    const index = client.index('vacatures');
    const docs = await index.getDocuments({ fields: ['summary', 'urlHash'], limit: 10 });
    console.log(docs.results);
    const result = await bulkUpsertVacatures([...docs.results]);
    console.log(result);
  });
});
