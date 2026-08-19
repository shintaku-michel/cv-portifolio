import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { db } from '../../server/database/client'
import { users } from '../../server/database/schema'
import { UserService } from '../../server/services/user.service'

const suffix = randomUUID().slice(0, 8)
const adminEmail = `test-user-admin-${suffix}@example.com`
const otherEmail = `test-user-other-${suffix}@example.com`

let adminId: string
let otherId: string

describe('UserService (integração)', () => {
  beforeAll(async () => {
    const [admin] = await db
      .insert(users)
      .values({ name: 'Admin de Teste', email: adminEmail, passwordHash: 'scrypt:1:1:1:aa:bb', role: 'ADMIN' })
      .returning()
    adminId = admin!.id

    const [other] = await db
      .insert(users)
      .values({ name: 'Outro Usuário', email: otherEmail, passwordHash: 'scrypt:1:1:1:aa:bb', role: 'USER' })
      .returning()
    otherId = other!.id
  })

  afterAll(async () => {
    await db.delete(users).where(eq(users.id, adminId))
    await db.delete(users).where(eq(users.id, otherId))
    await db.$client.end()
  })

  it('getAll nunca retorna passwordHash', async () => {
    const all = await UserService.getAll()
    const admin = all.find(u => u.id === adminId)
    expect(admin).toBeDefined()
    expect(admin).not.toHaveProperty('passwordHash')
  })

  it('promove um usuário para ADMIN', async () => {
    const updated = await UserService.updateRole(adminId, otherId, 'ADMIN')
    expect(updated.role).toBe('ADMIN')
  })

  it('rebaixa o outro usuário de volta para USER', async () => {
    const updated = await UserService.updateRole(adminId, otherId, 'USER')
    expect(updated.role).toBe('USER')
  })

  it('impede o admin de remover a própria permissão', async () => {
    await expect(UserService.updateRole(adminId, adminId, 'USER')).rejects.toMatchObject({ statusCode: 400 })
  })

  it('permite o admin "promover" a si mesmo (no-op sem erro)', async () => {
    const updated = await UserService.updateRole(adminId, adminId, 'ADMIN')
    expect(updated.role).toBe('ADMIN')
  })

  it('atualiza bio e avatarUrl do perfil', async () => {
    const updated = await UserService.updateProfile(otherId, {
      bio: 'Uma bio de teste',
      avatarUrl: 'https://example.com/avatar.png'
    })
    expect(updated.bio).toBe('Uma bio de teste')
    expect(updated.avatarUrl).toBe('https://example.com/avatar.png')
  })

  it('rejeita bio maior que o limite', async () => {
    await expect(UserService.updateProfile(otherId, { bio: 'x'.repeat(281) })).rejects.toMatchObject({ statusCode: 400 })
  })

  it('permite limpar bio e avatarUrl enviando string vazia', async () => {
    const updated = await UserService.updateProfile(otherId, { bio: '', avatarUrl: '' })
    expect(updated.bio).toBeNull()
    expect(updated.avatarUrl).toBeNull()
  })
})
