import { CategoryService } from '../../services/category.service'

export const categoryResolvers = {
  Query: {
    categories: () => CategoryService.getAll()
  }
}
