ALTER TABLE "user_searches" RENAME COLUMN "updated_date_time" TO "updated";--> statement-breakpoint
ALTER TABLE "user_searches" ADD COLUMN "created" timestamp with time zone DEFAULT now();