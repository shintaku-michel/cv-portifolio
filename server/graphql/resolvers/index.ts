import { DateTimeScalar } from '../scalars/date-time'
import { categoryResolvers } from './category'
import { commentResolvers } from './comment'
import { likeResolvers } from './like'
import { postResolvers } from './post'
import { projectResolvers } from './project'
import { tagResolvers } from './tag'
import { technologyResolvers } from './technology'
import { userResolvers } from './user'

export const resolvers = {
  DateTime: DateTimeScalar,
  Query: {
    ...technologyResolvers.Query,
    ...categoryResolvers.Query,
    ...tagResolvers.Query,
    ...projectResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query,
    ...userResolvers.Query
  },
  Mutation: {
    ...projectResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...userResolvers.Mutation,
    ...likeResolvers.Mutation
  },
  Comment: commentResolvers.Comment,
  Post: { ...likeResolvers.Post, ...commentResolvers.Post }
}
