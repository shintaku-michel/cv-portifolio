import { db } from '../database/client'
import { categories } from '../database/schema'

export const CategoryService = {
  async getAll() {
    return db.select().from(categories).orderBy(categories.name)
  }
}
