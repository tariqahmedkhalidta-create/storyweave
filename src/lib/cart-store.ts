/**
 * Cart / Order store — Prisma-backed.
 *
 * Public API is intentionally identical to the old in-memory version
 * (minus the fact that every method is now async), so call-sites only
 * need `await` added — no other changes.
 *
 * Mapping layer
 * ─────────────
 * The Prisma `Order` model stores appearance as four flat string columns
 * (skinTone, hairColor, hairStyle, eyeColor).  `toCartRecord()` re-assembles
 * them into the nested `appearance: CharacterAppearance` shape used
 * throughout the app.
 */

import { db } from './db'
import type { Order } from '@prisma/client'
import type { CharacterAppearance, SkinTone, HairColor, HairStyle, EyeColor } from './types'

// ── Domain types (re-exported so callers need only one import) ────────────────

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'generating'
  | 'fulfilled'
  | 'failed'

export interface CartRecord {
  orderId:               string
  bookId:                string
  bookTitle:             string
  childName:             string
  appearance:            CharacterAppearance
  priceFormatted:        string
  priceCents:            number
  createdAt:             Date
  status:                OrderStatus
  stripePaymentIntentId?: string
  customerEmail?:         string
  pdfS3Key?:              string
  progressMessage?:       string
}

// ── Mapping helper ────────────────────────────────────────────────────────────

function toCartRecord(row: Order): CartRecord {
  return {
    orderId:    row.id,
    bookId:     row.bookId,
    bookTitle:  row.bookTitle,
    childName:  row.childName,
    appearance: {
      skinTone:  row.skinTone  as SkinTone,
      hairColor: row.hairColor as HairColor,
      hairStyle: row.hairStyle as HairStyle,
      eyeColor:  row.eyeColor  as EyeColor,
    },
    priceFormatted:        row.priceFormatted,
    priceCents:            row.priceCents,
    createdAt:             row.createdAt,
    status:                row.status as OrderStatus,
    stripePaymentIntentId: row.stripePaymentIntentId ?? undefined,
    customerEmail:         row.customerEmail         ?? undefined,
    pdfS3Key:              row.pdfS3Key              ?? undefined,
    progressMessage:       row.progressMessage       ?? undefined,
  }
}

// ── Public store API ──────────────────────────────────────────────────────────

export const cartStore = {

  /** Create or overwrite an order row. */
  async set(record: CartRecord): Promise<CartRecord> {
    const row = await db.order.upsert({
      where:  { id: record.orderId },
      create: {
        id:                    record.orderId,
        bookId:                record.bookId,
        bookTitle:             record.bookTitle,
        childName:             record.childName,
        skinTone:              record.appearance.skinTone,
        hairColor:             record.appearance.hairColor,
        hairStyle:             record.appearance.hairStyle,
        eyeColor:              record.appearance.eyeColor,
        priceFormatted:        record.priceFormatted,
        priceCents:            record.priceCents,
        status:                record.status,
        stripePaymentIntentId: record.stripePaymentIntentId,
      },
      update: {
        bookId:                record.bookId,
        bookTitle:             record.bookTitle,
        childName:             record.childName,
        skinTone:              record.appearance.skinTone,
        hairColor:             record.appearance.hairColor,
        hairStyle:             record.appearance.hairStyle,
        eyeColor:              record.appearance.eyeColor,
        priceFormatted:        record.priceFormatted,
        priceCents:            record.priceCents,
        status:                record.status,
        stripePaymentIntentId: record.stripePaymentIntentId,
      },
    })
    return toCartRecord(row)
  },

  /** Fetch a single order. Returns undefined when not found. */
  async get(orderId: string): Promise<CartRecord | undefined> {
    const row = await db.order.findUnique({ where: { id: orderId } })
    return row ? toCartRecord(row) : undefined
  },

  /** Transition an order to a new status. */
  async updateStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      await db.order.update({ where: { id: orderId }, data: { status } })
      return true
    } catch {
      return false
    }
  },

  /** Attach a Stripe PaymentIntent ID (idempotency key for the payment flow). */
  async setPaymentIntent(orderId: string, paymentIntentId: string): Promise<boolean> {
    try {
      await db.order.update({
        where: { id: orderId },
        data:  { stripePaymentIntentId: paymentIntentId },
      })
      return true
    } catch {
      return false
    }
  },

  /** Persist the customer's email address (captured at checkout). */
  async setCustomerEmail(orderId: string, customerEmail: string): Promise<boolean> {
    try {
      await db.order.update({ where: { id: orderId }, data: { customerEmail } })
      return true
    } catch {
      return false
    }
  },

  /** Write a live progress message during PDF generation. */
  async updateProgress(orderId: string, progressMessage: string): Promise<boolean> {
    try {
      await db.order.update({ where: { id: orderId }, data: { progressMessage } })
      return true
    } catch {
      return false
    }
  },

  /** Store the S3 / R2 object key for the generated PDF. */
  async setPdfKey(orderId: string, pdfS3Key: string): Promise<boolean> {
    try {
      await db.order.update({ where: { id: orderId }, data: { pdfS3Key } })
      return true
    } catch {
      return false
    }
  },

  /** Hard-delete an order (e.g. test cleanup). */
  async delete(orderId: string): Promise<void> {
    await db.order.delete({ where: { id: orderId } }).catch(() => { /* already gone */ })
  },
}
