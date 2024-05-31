import { describe, it } from 'vitest';

import { vacatures } from '../drizzle/schema';
import { createInsertSchema } from 'drizzle-zod';

const insertSchema = createInsertSchema(vacatures, {
  url: (schema) => schema.url.url(),
  summary: (schema) => schema.summary.min(100).nullable(),
  title: (schema) => schema.title.min(5),
  professie: (schema) => schema.professie
})
  .required({
    title: true,
    summary: true,
    urlHash: true
  })
  .omit({ opleidingsbudgetSize: true });

describe('repotest', () => {
  it('should parse a vacature', async () => {
    const vacature = {
      title: 'Test vacature',
      summary: null,
      organisatie: 'Lentis',
      urlHash: '123',
      url: 'http://example.com',
      professie: ['Verpleegkundige'],
      body: 'This is a test vacature'
    };
    insertSchema.parse(vacature);
  });
});
