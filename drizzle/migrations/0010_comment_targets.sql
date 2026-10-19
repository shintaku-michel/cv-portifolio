ALTER TABLE "comments" ALTER COLUMN "post_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_project_id_idx" ON "comments" USING btree ("project_id");--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_single_target_check" CHECK (num_nonnulls("comments"."post_id", "comments"."project_id") = 1);