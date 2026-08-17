import { relations } from 'drizzle-orm'
import { categories } from './categories'
import { comments } from './comments'
import { likes } from './likes'
import { postTags } from './post-tags'
import { posts } from './posts'
import { projectTechnologies } from './project-technologies'
import { projects } from './projects'
import { sessions } from './sessions'
import { tags } from './tags'
import { technologies } from './technologies'
import { users } from './users'

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  posts: many(posts),
  comments: many(comments),
  likes: many(likes)
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] })
}))

export const technologiesRelations = relations(technologies, ({ many }) => ({
  projectTechnologies: many(projectTechnologies)
}))

export const projectsRelations = relations(projects, ({ many }) => ({
  projectTechnologies: many(projectTechnologies)
}))

export const projectTechnologiesRelations = relations(projectTechnologies, ({ one }) => ({
  project: one(projects, { fields: [projectTechnologies.projectId], references: [projects.id] }),
  technology: one(technologies, { fields: [projectTechnologies.technologyId], references: [technologies.id] })
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts)
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags)
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  category: one(categories, { fields: [posts.categoryId], references: [categories.id] }),
  postTags: many(postTags),
  comments: many(comments),
  likes: many(likes)
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] })
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  parent: one(comments, { fields: [comments.parentId], references: [comments.id], relationName: 'commentReplies' }),
  replies: many(comments, { relationName: 'commentReplies' })
}))

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, { fields: [likes.userId], references: [users.id] }),
  post: one(posts, { fields: [likes.postId], references: [posts.id] })
}))
