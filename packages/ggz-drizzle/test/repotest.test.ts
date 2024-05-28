import { describe, it } from 'vitest';
import { vacatures } from '../src/vacatures';

describe('repotest', () => {
  it('should pass', async () => {
    const result = await repo.allUrlsForOrganisation('Lentis');
    console.log(result);
  });
});
