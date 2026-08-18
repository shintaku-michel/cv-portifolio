import { createError } from 'h3'
import { db } from '../../database/client'
import type { CreateCommentInput } from '../../services/comment.service'
import { CommentService } from '../../services/comment.service'
import { assertAdmin, assertAuthenticated } from '../../utils/authorize'
import type { GraphQLContext } from '../context'

type CommentRow = { id: string, userId: string, status: 'PENDING' | 'VISIBLE' | 'HIDDEN', replies?: unknown }

function canView(comment: { status: string, userId: string }, context: GraphQLContext): boolean {
  return comment.status === 'VISIBLE' || context.user?.role === 'ADMIN' || context.user?.id === comment.userId
}

export const commentResolvers = {
  Query: {
    comments: (_parent: unknown, { postId }: { postId: string }) => CommentService.getVisible(postId),

    pendingComments: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      assertAdmin(context.user)
      return CommentService.getPending()
    },

    comment: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      const comment = await CommentService.getById(id)
      if (!comment || !canView(comment, context)) {
        return null
      }
      return comment
    },

    adminComments: (_parent: unknown, { status }: { status: 'PENDING' | 'VISIBLE' | 'HIDDEN' }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return CommentService.getByStatus(status)
    }
  },

  Mutation: {
    createComment: (_parent: unknown, { input }: { input: CreateCommentInput }, context: GraphQLContext) => {
      assertAuthenticated(context.user)
      return CommentService.create(context.user.id, input)
    },

    approveComment: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return CommentService.approve(id)
    },

    hideComment: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return CommentService.hide(id)
    },

    deleteComment: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAuthenticated(context.user)
      const comment = await CommentService.getById(id)
      if (!comment) {
        throw createError({ statusCode: 404, message: 'Comentário não encontrado' })
      }
      if (context.user.role !== 'ADMIN' && comment.userId !== context.user.id) {
        throw createError({ statusCode: 403, message: 'Você só pode excluir seus próprios comentários' })
      }
      return CommentService.delete(id)
    }
  },

  Comment: {
    replies: async (parent: CommentRow, _args: unknown, context: GraphQLContext) => {
      if (parent.replies) {
        return parent.replies
      }
      const rows = await db.query.comments.findMany({
        with: { user: true },
        where: (c, { eq }) => eq(c.parentId, parent.id),
        orderBy: (c, { asc }) => [asc(c.createdAt)]
      })
      return rows.filter(row => canView(row, context))
    }
  }
}
