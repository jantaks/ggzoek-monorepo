import {
  bigint,
  boolean,
  json,
  numeric,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const keyStatus = pgEnum('key_status', ['default', 'valid', 'invalid', 'expired']);
export const keyType = pgEnum('key_type', [
  'aead-ietf',
  'aead-det',
  'hmacsha512',
  'hmacsha256',
  'auth',
  'shorthash',
  'generichash',
  'kdf',
  'secretbox',
  'secretstream',
  'stream_xchacha20'
]);
export const factorType = pgEnum('factor_type', ['totp', 'webauthn']);
export const factorStatus = pgEnum('factor_status', ['unverified', 'verified']);
export const aalLevel = pgEnum('aal_level', ['aal1', 'aal2', 'aal3']);
export const codeChallengeMethod = pgEnum('code_challenge_method', ['s256', 'plain']);

export const auth = pgSchema('auth');

export const users = auth.table('users', {
  id: uuid('id').primaryKey().notNull()
});

export const likes = pgTable('likes', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  vacature: text('vacature')
    .notNull()
    .references(() => vacatures.urlHash, { onDelete: 'cascade' })
});

export const scrapeResults = pgTable('scrape_results', {
  scraperName: text('scraper').notNull(),
  vacaturesFound: bigint('vacatures_found', { mode: 'number' }).notNull(),
  vacaturesUpdated: bigint('vacatures_updated', { mode: 'number' }).notNull(),
  newUrls: bigint('new_urls', { mode: 'number' }),
  requestsFinished: bigint('requests_finished', { mode: 'number' }).notNull(),
  requestsFailed: bigint('requests_failed', { mode: 'number' }),
  requestsRetries: bigint('requests_retries', { mode: 'number' }),
  requestsFailedPerMinute: bigint('requests_failed_per_minute', { mode: 'number' }),
  requestsFinishedPerMinute: bigint('requests_finished_per_minute', { mode: 'number' }),
  requestMinDurationMillis: bigint('request_min_duration_millis', { mode: 'number' }),
  requestMaxDurationMillis: bigint('request_max_duration_millis', { mode: 'number' }),
  requestTotalFailedDurationMillis: bigint('request_total_failed_duration_millis', {
    mode: 'number'
  }),
  requestTotalFinishedDurationMillis: bigint('request_total_finished_duration_millis', {
    mode: 'number'
  }),
  crawlerStartedAt: timestamp('crawler_started_at', { mode: 'date', withTimezone: true }),
  crawlerFinishedAt: timestamp('crawler_finished_at', {
    mode: 'date',
    withTimezone: true
  }),
  statsPersistedAt: timestamp('stats_persisted_at', { mode: 'date', withTimezone: true }),
  crawlerRuntimeMillis: bigint('crawler_runtime_millis', { mode: 'number' }),
  requestsWithStatusCode: json('requests_with_status_code'),
  errors: json('errors'),
  retryErrors: json('retry_errors')
});

export type InsertScrapeResult = typeof scrapeResults.$inferInsert;
export type SelectScrapeResult = typeof scrapeResults.$inferSelect;

export const vacatures = pgTable('vacatures', {
  urlHash: text('url_hash').primaryKey().notNull(),
  organisatie: text('organisatie').notNull(),
  instelling: text('instelling'),
  organisatieOnderdeel: text('organisatie_onderdeel'),
  title: text('title').notNull(),
  salarisMin: bigint('salaris_min', { mode: 'number' }),
  salarisMax: bigint('salaris_max', { mode: 'number' }),
  cao: text('CAO'),
  contract: text('contract'),
  reiskostenvergoeding: text('reiskostenvergoeding'),
  werkvorm: text('werkvorm'),
  opleidingsbudget: text('opleidingsbudget'),
  opleidingsbudgetSize: numeric('opleidingsbudget_size'),
  body: text('body'),
  summary: text('summary'),
  url: text('url').notNull(),
  bodyHash: text('body_hash'),
  firstScraped: timestamp('first_scraped', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  lastScraped: timestamp('last_scraped', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  synced: boolean('synced').default(false),
  urenMin: bigint('uren_min', { mode: 'number' }),
  urenMax: bigint('uren_max', { mode: 'number' }),
  professie: text('professie').array().notNull(),
  beroepen: text('beroepen').array().notNull(),
  stoornissen: json('stoornissen'),
  behandelmethoden: json('behandelmethoden'),
  fwg: text('FWG'),
  locaties: json('locaties'),
  schaalMin: text('schaal_min'),
  schaalMax: text('schaal_max'),
  screenshotUrl: text('screenshot_url')
});

const selectSchema = createSelectSchema(vacatures);

export const insertSchema = createInsertSchema(vacatures, {
  url: (schema) => schema.url.url(),
  summary: (schema) => schema.summary,
  title: (schema) => schema.title.min(5),
  professie: (schema) => schema.professie,
  urenMin: (schema) => schema.urenMin,
  urenMax: (schema) => schema.urenMax
})
  .required({
    title: true,
    summary: true,
    urlHash: true
  })
  .omit({ opleidingsbudgetSize: true });

export type InsertVacature = typeof vacatures.$inferInsert;
export type SelectVacature = typeof vacatures.$inferSelect;

export type MinimumVacature = Pick<
  InsertVacature,
  | 'urlHash'
  | 'organisatie'
  | 'title'
  | 'body'
  | 'url'
  | 'bodyHash'
  | 'firstScraped'
  | 'lastScraped'
  | 'professie'
>;
