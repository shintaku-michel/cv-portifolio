import { createError } from 'h3'
import type { CommentTargetRef } from '../../../shared/types/comment'
import type { CreateCommentInput } from '../../services/comment.service'
import { CommentService, toCommentTarget } from '../../services/comment.service'
import { assertAdmin, assertAuthenticated } from '../../utils/authorize'
import { checkRateLimit } from '../../utils/rate-limit'
import type { GraphQLContext } from '../context'

type CommentRow = Parameters<typeof toCommentTarget>[0] & { id: string, replies?: unknown }
type TargetRow = { id: string }

// Por usuário, não por IP: só autenticados comentam. ADMIN fica de fora
// porque responde em lote ao moderar.
const COMMENT_LIMIT = 10
const COMMENT_WINDOW_MS = 10 * 60 * 1000

function canView(comment: { status: string, userId: string }, context: GraphQLContext): boolean {
  return comment.status === 'VISIBLE' || context.user?.role === 'ADMIN' || context.user?.id === comment.userId
}

export const commentResolvers = {
  Query: {
    comments: (_parent: unknown, { target }: { target: CommentTargetRef }) => CommentService.getVisible(target),

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
      if (context.user.role !== 'ADMIN' && !checkRateLimit(`comment:${context.user.id}`, COMMENT_LIMIT, COMMENT_WINDOW_MS)) {
        throw createError({ statusCode: 429, message: 'Muitos comentários em pouco tempo. Tente novamente mais tarde.' })
      }
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

  Post: {
    commentsCount: (parent: TargetRow) => CommentService.countVisible({ type: 'POST', id: parent.id })
  },

  Project: {
    commentsCount: (parent: TargetRow) => CommentService.countVisible({ type: 'PROJECT', id: parent.id })
  },

  Comment: {
    target: (parent: CommentRow) => toCommentTarget(parent),

    replies: async (parent: CommentRow, _args: unknown, context: GraphQLContext) => {
      if (parent.replies) {
        return parent.replies
      }
      const rows = await CommentService.getReplies(parent.id)
      return rows.filter(row => canView(row, context))
    }
  }
}
