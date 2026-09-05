ALTER TABLE "technologies" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "technologies" ALTER COLUMN "category" SET DEFAULT 'FRONTEND'::text;--> statement-breakpoint
DROP TYPE "public"."technology_category";--> statement-breakpoint
CREATE TYPE "public"."technology_category" AS ENUM('FRONTEND', 'BACKEND', 'API', 'DATABASE', 'ORM', 'CLOUD', 'DEVOPS', 'BUILD_TOOLS', 'TESTING', 'AI', 'SECURITY', 'PAYMENTS', 'ARCHITECTURE', 'INFRASTRUCTURE', 'VERSION_CONTROL', 'OBSERVABILITY');--> statement-breakpoint
ALTER TABLE "technologies" ALTER COLUMN "category" SET DEFAULT 'FRONTEND'::"public"."technology_category";--> statement-breakpoint
ALTER TABLE "technologies" ALTER COLUMN "category" SET DATA TYPE "public"."technology_category" USING "category"::"public"."technology_category";