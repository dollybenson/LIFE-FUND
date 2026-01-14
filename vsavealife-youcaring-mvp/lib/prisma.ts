
import { PrismaClient } from '@prisma/client'

let prismaSingleton: PrismaClient | null = null

export function getPrisma() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('Missing DATABASE_URL environment variable')
  }

  if (!prismaSingleton) {
    prismaSingleton = new PrismaClient()
  }

  return prismaSingleton
}
