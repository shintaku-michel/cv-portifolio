import { TagService } from '../../services/tag.service'

export const tagResolvers = {
  Query: {
    tags: () => TagService.getAll()
  }
}
