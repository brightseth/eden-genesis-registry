import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { prisma } from './db'
import { Role } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET!

export interface JWTPayload {
  userId: string
  email: string
  role: Role
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}

export function generateInviteToken(): string {
  return randomBytes(32).toString('hex')
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function getUserFromToken(token: string) {
  try {
    const payload = verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })
    return user
  } catch {
    return null
  }
}