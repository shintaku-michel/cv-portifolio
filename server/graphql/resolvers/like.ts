import { createError } from 'h3'
import { LikeService } from '../../services/like.service'
import { PostService } from '../../services/post.service'
import { assertAuthenticated } from '../../utils/authorize'
import type { GraphQLContext } from '../context'

type PostRow = { id: string }

// Só permite curtir posts PUBLISHED — sem isso, o retorno da mutation
// vazaria o conteúdo de um post DRAFT (nunca deve aparecer publicamente).
async function getLikeablePost(postId: string) {
  const post = await PostService.getById(postId)
  if (!post || post.status !== 'PUBLISHED') {
    throw createError({ statusCode: 404, message: 'Post não encontrado' })
  }
  return post
}

export const likeResolvers = {
  Mutation: {
    likePost: async (_parent: unknown, { postId }: { postId: string }, context: GraphQLContext) => {
      assertAuthenticated(context.user)
      await getLikeablePost(postId)
      await LikeService.like(postId, context.user.id)
      return PostService.getById(postId)
    },

    unlikePost: async (_parent: unknown, { postId }: { postId: string }, context: GraphQLContext) => {
      assertAuthenticated(context.user)
      await getLikeablePost(postId)
      await LikeService.unlike(postId, context.user.id)
      return PostService.getById(postId)
    }
  },

  Post: {
    likesCount: (parent: PostRow) => LikeService.countForPost(parent.id),
    likedByMe: (parent: PostRow, _args: unknown, context: GraphQLContext) =>
      context.user ? LikeService.isLikedBy(parent.id, context.user.id) : false
  }
}
