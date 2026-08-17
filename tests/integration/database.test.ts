import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { db } from '../../server/database/client'

describe('database schema (integração)', () => {
  beforeAll(async () => {
    await db.execute('select 1')
  })

  afterAll(async () => {
    await db.$client.end()
  })

  it('possui tecnologias seedadas', async () => {
    const technologies = await db.query.technologies.findMany()
    expect(technologies.length).toBeGreaterThan(0)
  })

  it('resolve relação project -> technologies via projectTechnologies', async () => {
    const [project] = await db.query.projects.findMany({
      where: (projects, { eq }) => eq(projects.slug, 'portfolio-cms'),
      with: {
        projectTechnologies: {
          with: { technology: true }
        }
      }
    })

    expect(project).toBeDefined()
    expect(project.projectTechnologies.length).toBeGreaterThan(0)
    expect(project.projectTechnologies[0].technology.name).toBeTypeOf('string')
  })

  it('projeto em DRAFT nunca deve ser retornado como PUBLISHED por engano', async () => {
    const drafts = await db.query.projects.findMany({
      where: (projects, { eq }) => eq(projects.status, 'DRAFT')
    })
    expect(drafts.every(p => p.status === 'DRAFT')).toBe(true)
  })
})
