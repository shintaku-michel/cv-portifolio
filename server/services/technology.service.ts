import { db } from '../database/client'
import { technologies } from '../database/schema'

export const TechnologyService = {
  async getAll() {
    return db.select().from(technologies).orderBy(technologies.name)
  }
}
