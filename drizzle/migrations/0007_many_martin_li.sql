CREATE TYPE "public"."certificate_category" AS ENUM('DESENVOLVIMENTO_WEB', 'UX_UI_DESIGN', 'DEVOPS', 'BACKEND', 'GESTAO_DE_PROJETOS');--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "certificate_category" NOT NULL,
	"completed_at" date NOT NULL,
	"image" text,
	"online_url" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
