import type { CreatePostInput, UpdatePostInput } from '../../services/post.service'
import { PostService } from '../../services/post.service'
import { assertAdmin } from '../../utils/authorize'
import type { GraphQLContext } from '../context'

export const postResolvers = {
  Query: {
    posts: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      context.user?.role === 'ADMIN' ? PostService.getAll() : PostService.getPublished(),

    post: (_parent: unknown, { slug }: { slug: string }, context: GraphQLContext) =>
      PostService.getBySlug(slug, { includeDraft: context.user?.role === 'ADMIN' }),

    postById: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return PostService.getById(id)
    },

    featuredPosts: () => PostService.getFeatured()
  },

  Mutation: {
    createPost: (_parent: unknown, { input }: { input: CreatePostInput }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return PostService.create(context.user.id, input)
    },

    updatePost: (_parent: unknown, { id, input }: { id: string, input: UpdatePostInput }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return PostService.update(id, input)
    },

    publishPost: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return PostService.publish(id)
    },

    unpublishPost: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return PostService.unpublish(id)
    },

    deletePost: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return PostService.delete(id)
    }
  }
}
