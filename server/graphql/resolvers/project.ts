import type { CreateProjectInput, UpdateProjectInput } from '../../services/project.service'
import { ProjectService } from '../../services/project.service'
import { assertAdmin } from '../../utils/authorize'
import type { GraphQLContext } from '../context'

export const projectResolvers = {
  Query: {
    projects: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      context.user?.role === 'ADMIN' ? ProjectService.getAll() : ProjectService.getPublished(),

    project: (_parent: unknown, { slug }: { slug: string }, context: GraphQLContext) =>
      ProjectService.getBySlug(slug, { includeDraft: context.user?.role === 'ADMIN' }),

    projectById: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return ProjectService.getById(id)
    },

    featuredProjects: () => ProjectService.getFeatured()
  },

  Mutation: {
    createProject: (_parent: unknown, { input }: { input: CreateProjectInput }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return ProjectService.create(input)
    },

    updateProject: (_parent: unknown, { id, input }: { id: string, input: UpdateProjectInput }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return ProjectService.update(id, input)
    },

    publishProject: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return ProjectService.publish(id)
    },

    unpublishProject: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return ProjectService.unpublish(id)
    },

    deleteProject: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return ProjectService.delete(id)
    }
  }
}
