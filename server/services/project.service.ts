import { eq } from 'drizzle-orm'
import { createError } from 'h3'
import { db } from '../database/client'
import { projects, projectTechnologies } from '../database/schema'
import { isUniqueViolation } from '../utils/db-errors'

type Technology = { id: string, name: string, slug: string, createdAt: Date }
type ProjectWithTechnologiesRow = { projectTechnologies: { technology: Technology }[] } & Record<string, unknown>

function toProject<T extends ProjectWithTechnologiesRow>(row: T) {
  const { projectTechnologies: relations, ...rest } = row
  return { ...rest, technologies: relations.map(r => r.technology) }
}

export type CreateProjectInput = {
  title: string
  slug: string
  shortDescription: string
  description: string
  coverImage?: string | null
  gallery?: string[]
  demoUrl?: string | null
  repositoryUrl?: string | null
  startDate?: string | null
  endDate?: string | null
  featured?: boolean
  displayOrder?: number
  technologyIds?: string[]
}

export type UpdateProjectInput = Partial<CreateProjectInput>

async function setTechnologies(projectId: string, technologyIds: string[] | undefined) {
  if (technologyIds === undefined) {
    return
  }
  await db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, projectId))
  if (technologyIds.length > 0) {
    await db.insert(projectTechnologies).values(technologyIds.map(technologyId => ({ projectId, technologyId })))
  }
}

export const ProjectService = {
  async getAll() {
    const rows = await db.query.projects.findMany({
      with: { projectTechnologies: { with: { technology: true } } },
      orderBy: (p, { asc }) => [asc(p.displayOrder), asc(p.title)]
    })
    return rows.map(toProject)
  },

  async getPublished() {
    const rows = await db.query.projects.findMany({
      with: { projectTechnologies: { with: { technology: true } } },
      where: (p, { eq }) => eq(p.status, 'PUBLISHED'),
      orderBy: (p, { asc }) => [asc(p.displayOrder), asc(p.title)]
    })
    return rows.map(toProject)
  },

  async getFeatured() {
    const rows = await db.query.projects.findMany({
      with: { projectTechnologies: { with: { technology: true } } },
      where: (p, { and, eq }) => and(eq(p.status, 'PUBLISHED'), eq(p.featured, true)),
      orderBy: (p, { asc }) => [asc(p.displayOrder), asc(p.title)]
    })
    return rows.map(toProject)
  },

  // `includeDraft: true` só deve ser usado quando o chamador já foi validado
  // como ADMIN no resolver — projetos DRAFT nunca podem vazar publicamente.
  async getBySlug(slug: string, options: { includeDraft: boolean }) {
    const row = await db.query.projects.findFirst({
      with: { projectTechnologies: { with: { technology: true } } },
      where: (p, { eq }) => eq(p.slug, slug)
    })
    if (!row) {
      return null
    }
    if (row.status === 'DRAFT' && !options.includeDraft) {
      return null
    }
    return toProject(row)
  },

  async getById(id: string) {
    const row = await db.query.projects.findFirst({
      with: { projectTechnologies: { with: { technology: true } } },
      where: (p, { eq }) => eq(p.id, id)
    })
    return row ? toProject(row) : null
  },

  async create(input: CreateProjectInput) {
    try {
      const [project] = await db
        .insert(projects)
        .values({
          title: input.title,
          slug: input.slug,
          shortDescription: input.shortDescription,
          description: input.description,
          coverImage: input.coverImage,
          gallery: input.gallery ?? [],
          demoUrl: input.demoUrl,
          repositoryUrl: input.repositoryUrl,
          startDate: input.startDate,
          endDate: input.endDate,
          featured: input.featured ?? false,
          displayOrder: input.displayOrder ?? 0
        })
        .returning()

      await setTechnologies(project!.id, input.technologyIds)
      return ProjectService.getBySlug(project!.slug, { includeDraft: true })
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw createError({ statusCode: 409, message: 'Já existe um projeto com esse slug' })
      }
      throw error
    }
  },

  async update(id: string, input: UpdateProjectInput) {
    const { technologyIds, ...fields } = input

    try {
      if (Object.keys(fields).length > 0) {
        await db.update(projects).set({ ...fields, updatedAt: new Date() }).where(eq(projects.id, id))
      }
      await setTechnologies(id, technologyIds)
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw createError({ statusCode: 409, message: 'Já existe um projeto com esse slug' })
      }
      throw error
    }

    const updated = await db.query.projects.findFirst({
      with: { projectTechnologies: { with: { technology: true } } },
      where: (p, { eq }) => eq(p.id, id)
    })
    if (!updated) {
      throw createError({ statusCode: 404, message: 'Projeto não encontrado' })
    }
    return toProject(updated)
  },

  async setStatus(id: string, status: 'DRAFT' | 'PUBLISHED') {
    const [updated] = await db.update(projects).set({ status, updatedAt: new Date() }).where(eq(projects.id, id)).returning()
    if (!updated) {
      throw createError({ statusCode: 404, message: 'Projeto não encontrado' })
    }
    return ProjectService.getBySlug(updated.slug, { includeDraft: true })
  },

  async publish(id: string) {
    return ProjectService.setStatus(id, 'PUBLISHED')
  },

  async unpublish(id: string) {
    return ProjectService.setStatus(id, 'DRAFT')
  },

  async delete(id: string) {
    const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning()
    return Boolean(deleted)
  }
}
