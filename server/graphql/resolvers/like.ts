import type { ContentType } from '../../../shared/types/content'
import { LikeService } from '../../services/like.service'
import { PostService } from '../../services/post.service'
import { ProjectService } from '../../services/project.service'
import { assertAuthenticated } from '../../utils/authorize'
import type { GraphQLContext } from '../context'

type ContentRow = { id: string }

// likesCount/likedByMe iguais para qualquer tipo de conteúdo.
function likeFields(type: ContentType) {
  return {
    likesCount: (parent: ContentRow) => LikeService.countFor({ type, id: parent.id }),
    likedByMe: (parent: ContentRow, _args: unknown, context: GraphQLContext) =>
      context.user ? LikeService.isLikedBy({ type, id: parent.id }, context.user.id) : false
  }
}

export const likeResolvers = {
  Mutation: {
    likePost: async (_parent: unknown, { postId }: { postId: string }, context: GraphQLContext) => {
      assertAuthenticated(context.user)
      await LikeService.like({ type: 'POST', id: postId }, context.user.id)
      return PostService.getById(postId)
    },

    unlikePost: async (_parent: unknown, { postId }: { postId: string }, context: GraphQLContext) => {
      assertAuthenticated(context.user)
      await LikeService.unlike({ type: 'POST', id: postId }, context.user.id)
      return PostService.getById(postId)
    },

    likeProject: async (_parent: unknown, { projectId }: { projectId: string }, context: GraphQLContext) => {
      assertAuthenticated(context.user)
      await LikeService.like({ type: 'PROJECT', id: projectId }, context.user.id)
      return ProjectService.getById(projectId)
    },

    unlikeProject: async (_parent: unknown, { projectId }: { projectId: string }, context: GraphQLContext) => {
      assertAuthenticated(context.user)
      await LikeService.unlike({ type: 'PROJECT', id: projectId }, context.user.id)
      return ProjectService.getById(projectId)
    }
  },

  Post: likeFields('POST'),
  Project: likeFields('PROJECT')
}
