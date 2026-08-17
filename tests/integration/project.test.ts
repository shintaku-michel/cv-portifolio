import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { db } from '../../server/database/client'
import { projects, technologies } from '../../server/database/schema'
import { ProjectService } from '../../server/services/project.service'

const suffix = randomUUID().slice(0, 8)
const techName = `TestTech-${suffix}`
const techSlug = `testtech-${suffix}`

let technologyId: string

describe('ProjectService (integração)', () => {
  beforeAll(async () => {
    const [tech] = await db.insert(technologies).values({ name: techName, slug: techSlug }).returning()
    technologyId = tech!.id
  })

  afterAll(async () => {
    await db.delete(projects).where(eq(projects.slug, `projeto-teste-${suffix}`))
    await db.delete(technologies).where(eq(technologies.id, technologyId))
    await db.$client.end()
  })

  it('cria projeto como DRAFT e associa tecnologias', async () => {
    const project = await ProjectService.create({
      title: 'Projeto de Teste',
      slug: `projeto-teste-${suffix}`,
      shortDescription: 'curta',
      description: 'completa',
      technologyIds: [technologyId]
    })

    expect(project?.status).toBe('DRAFT')
    expect(project?.technologies).toHaveLength(1)
    expect(project?.technologies[0]?.id).toBe(technologyId)
  })

  it('projeto DRAFT não aparece para chamador público (includeDraft: false)', async () => {
    const publicView = await ProjectService.getBySlug(`projeto-teste-${suffix}`, { includeDraft: false })
    expect(publicView).toBeNull()

    const adminView = await ProjectService.getBySlug(`projeto-teste-${suffix}`, { includeDraft: true })
    expect(adminView).not.toBeNull()
  })

  it('publishProject torna o projeto visível publicamente', async () => {
    const draft = await ProjectService.getBySlug(`projeto-teste-${suffix}`, { includeDraft: true })
    await ProjectService.publish(draft!.id)

    const publicView = await ProjectService.getBySlug(`projeto-teste-${suffix}`, { includeDraft: false })
    expect(publicView?.status).toBe('PUBLISHED')

    const published = await ProjectService.getPublished()
    expect(published.some(p => p.slug === `projeto-teste-${suffix}`)).toBe(true)
  })

  it('rejeita slug duplicado com 409', async () => {
    await expect(
      ProjectService.create({
        title: 'Outro',
        slug: `projeto-teste-${suffix}`,
        shortDescription: 'x',
        description: 'y'
      })
    ).rejects.toMatchObject({ statusCode: 409 })
  })

  it('unpublishProject volta para DRAFT e some da listagem pública', async () => {
    const project = await ProjectService.getBySlug(`projeto-teste-${suffix}`, { includeDraft: true })
    await ProjectService.unpublish(project!.id)

    const published = await ProjectService.getPublished()
    expect(published.some(p => p.slug === `projeto-teste-${suffix}`)).toBe(false)
  })

  it('deleteProject remove o projeto', async () => {
    const project = await ProjectService.getBySlug(`projeto-teste-${suffix}`, { includeDraft: true })
    const deleted = await ProjectService.delete(project!.id)
    expect(deleted).toBe(true)

    const afterDelete = await ProjectService.getBySlug(`projeto-teste-${suffix}`, { includeDraft: true })
    expect(afterDelete).toBeNull()
  })
})
