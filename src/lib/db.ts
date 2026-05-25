/**
 * Prisma client singleton.
 *
 * Next.js hot-reloads modules in development, which would create a new
 * PrismaClient on every reload and quickly exhaust the database connection
 * pool. The global variable trick prevents that: the instance is stored on
 * the Node.js `global` object (which survives hot-reloads) and reused.
 *
 * In production the module is only ever loaded once, so `global.__prisma`
 * is never set and a fresh client is created normally.
 *
 * Usage:
 *   import { db } from '@/lib/db'
 *   const order = await db.order.findUnique({ where: { id } })
 */

import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const db: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = db
}
