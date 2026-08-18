import type { UserRole } from '../../../shared/types/auth'
import { UserService } from '../../services/user.service'
import { assertAdmin } from '../../utils/authorize'
import type { GraphQLContext } from '../context'

export const userResolvers = {
  Query: {
    users: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      assertAdmin(context.user)
      return UserService.getAll()
    }
  },

  Mutation: {
    updateUserRole: (_parent: unknown, { id, role }: { id: string, role: UserRole }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return UserService.updateRole(context.user.id, id, role)
    }
  }
}
