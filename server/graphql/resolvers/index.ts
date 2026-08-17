import { DateTimeScalar } from '../scalars/date-time'
import { categoryResolvers } from './category'
import { commentResolvers } from './comment'
import { postResolvers } from './post'
import { projectResolvers } from './project'
import { technologyResolvers } from './technology'

export const resolvers = {
  DateTime: DateTimeScalar,
  Query: {
    ...technologyResolvers.Query,
    ...categoryResolvers.Query,
    ...projectResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query
  },
  Mutation: {
    ...projectResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation
  },
  Comment: commentResolvers.Comment
}
