import {  describe, it } from 'vitest';
import { repo } from '../src/repo';

describe('repotest', ()=>{
  it('should pass', async ()=>{
    const result = await repo.allUrlsForOrganisation('Lentis')
    console.log(result)
  })
})