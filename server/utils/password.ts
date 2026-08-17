import type { ScryptOptions } from 'node:crypto'
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

// util.promisify não resolve corretamente a sobrecarga de scrypt() que
// aceita `options` — tipamos explicitamente para evitar o cast por chamada.
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions
) => Promise<Buffer>

const SCRYPT_N = 16384
const SCRYPT_R = 8
const SCRYPT_P = 1
const KEY_LENGTH = 64

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16)
  const derivedKey = await scryptAsync(plain, salt, KEY_LENGTH, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P })

  return `scrypt:${SCRYPT_N}:${SCRYPT_R}:${SCRYPT_P}:${salt.toString('hex')}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  const [algorithm, nStr, rStr, pStr, saltHex, keyHex] = hash.split(':')
  if (algorithm !== 'scrypt' || !nStr || !rStr || !pStr || !saltHex || !keyHex) {
    return false
  }

  const salt = Buffer.from(saltHex, 'hex')
  const expectedKey = Buffer.from(keyHex, 'hex')
  const derivedKey = await scryptAsync(plain, salt, expectedKey.length, {
    N: Number(nStr),
    r: Number(rStr),
    p: Number(pStr)
  })

  return derivedKey.length === expectedKey.length && timingSafeEqual(derivedKey, expectedKey)
}
