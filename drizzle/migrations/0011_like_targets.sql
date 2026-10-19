ALTER TABLE "likes" ALTER COLUMN "post_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "likes_project_id_idx" ON "likes" USING btree ("project_id");--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_project_unique" UNIQUE("user_id","project_id");--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_single_target_check" CHECK (num_nonnulls("likes"."post_id", "likes"."project_id") = 1);