import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { projects } from './projects'
import { technologies } from './technologies'

export const projectTechnologies = pgTable(
  'project_technologies',
  {
    projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    technologyId: uuid('technology_id').notNull().references(() => technologies.id, { onDelete: 'cascade' })
  },
  table => [primaryKey({ columns: [table.projectId, table.technologyId] })]
)
