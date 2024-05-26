import { log } from './logger';

log.info('Dit is info', { scraper: 'Parnassia' });
log.debug('Een stukje debuggen', { scraper: 'Parnassia' });
log.warn('Een waarschuwing met onbekende metadata', { onbekend: 'Parnassia' });
log.error('Een foutmelding! met onbekende metadata', { onbekend: 'Parnassia' });

const child = log.child({ scraper: 'GGZ Centraal' });

child.debug('Een stukje debuggen');

try{
  throw new Error('Dit is een test error');
}
catch(e){
  log.error(e);
}
