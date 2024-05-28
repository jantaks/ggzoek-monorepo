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
import { z } from 'zod';

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
  newUrls: bigint('new_urls', { mode: 'number' }).notNull(),
  requestsFinished: bigint('requests_finished', { mode: 'number' }).notNull(),
  requestsFailed: bigint('requests_failed', { mode: 'number' }).notNull(),
  requestsRetries: bigint('requests_retries', { mode: 'number' }).notNull(),
  requestsFailedPerMinute: bigint('requests_failed_per_minute', { mode: 'number' }).notNull(),
  requestsFinishedPerMinute: bigint('requests_finished_per_minute', { mode: 'number' }).notNull(),
  requestMinDurationMillis: bigint('request_min_duration_millis', { mode: 'number' }).notNull(),
  requestMaxDurationMillis: bigint('request_max_duration_millis', { mode: 'number' }).notNull(),
  requestTotalFailedDurationMillis: bigint('request_total_failed_duration_millis', {
    mode: 'number'
  }).notNull(),
  requestTotalFinishedDurationMillis: bigint('request_total_finished_duration_millis', {
    mode: 'number'
  }).notNull(),
  crawlerStartedAt: timestamp('crawler_started_at', { mode: 'date', withTimezone: true }).notNull(),
  crawlerFinishedAt: timestamp('crawler_finished_at', {
    mode: 'date',
    withTimezone: true
  }).notNull(),
  statsPersistedAt: timestamp('stats_persisted_at', { mode: 'date', withTimezone: true }),
  crawlerRuntimeMillis: bigint('crawler_runtime_millis', { mode: 'number' }).notNull(),
  requestsWithStatusCode: json('requests_with_status_code').notNull(),
  errors: json('errors').notNull(),
  retryErrors: json('retry_errors').notNull()
});

export type InsertScrapeResult = typeof scrapeResults.$inferInsert;
export type SelectScrapeResult = typeof scrapeResults.$inferSelect;

export const vacatures = pgTable('vacatures', {
  urlHash: text('url_hash').primaryKey().notNull(),
  organisatie: text('organisatie').notNull(),
  instelling: text('instelling'),
  organisatieOnderdeel: text('organisatie_onderdeel'),
  title: text('title').notNull(),
  salarisMin: numeric('salaris_min'),
  salarisMax: numeric('salaris_max'),
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
  urenMin: numeric('uren_min'),
  urenMax: numeric('uren_max'),
  professie: text('professie').array().notNull(),
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
  summary: (schema) => schema.summary.min(100).nullable(),
  title: (schema) => schema.title.min(5),
  professie: (schema) => schema.professie.array()
})
  .required({
    title: true,
    summary: true,
    urlHash: true
  })
  .omit({ opleidingsbudgetSize: true });

export type InsertVacature = z.infer<typeof insertSchema>;
export type SelectVacature = z.infer<typeof selectSchema>;

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
