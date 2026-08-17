import { db } from '../database/client'
import { tags } from '../database/schema'

export const TagService = {
  async getAll() {
    return db.select().from(tags).orderBy(tags.name)
  }
}
