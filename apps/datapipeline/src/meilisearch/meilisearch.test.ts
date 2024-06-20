import { describe, it } from 'vitest';
import { getVacaturesNearby } from './meilisearch.js';

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
