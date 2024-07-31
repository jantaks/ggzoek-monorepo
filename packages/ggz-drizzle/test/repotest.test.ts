import { describe, expect, it } from 'vitest';

import { vacatures } from '../src/schema';
import { createInsertSchema } from 'drizzle-zod';
import { getAllProfessies } from '../src/vacatures';

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
  it('should return professies', async () => {
    const result = await getAllProfessies();
    expect(result).toBeDefined();
    console.log(result);
  });
});
