import { repo } from './repo.js';
import { log } from '@ggzoek/logging/src/logger.js';

const result = await repo.allUrlsForOrganisation('Lentis')
log.info(result);