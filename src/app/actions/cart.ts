'use server'

import { cartStore } from '@/lib/cart-store'
import { getBook }   from '@/lib/catalog'
import type { CharacterAppearance } from '@/lib/types'

// ── Types ────────────────────────────────────────────────────────────────────

export interface AddToCartInput {
  bookId: string
  childName: string
  appearance: CharacterAppearance
}

export type AddToCartResult =
  | { success: true;  orderId: string }
  | { success: false; error: string }

// ── Server Action ────────────────────────────────────────────────────────────

export async function addToCart(input: AddToCartInput): Promise<AddToCartResult> {
  try {
    const { bookId, childName, appearance } = input

    // ── Validate name ───────────────────────────────────────────────────────
    const trimmed = childName.trim()
    if (!trimmed) {
      return { success: false, error: 'Please enter the child\'s name.' }
    }
    if (trimmed.length < 2) {
      return { success: false, error: 'Name must be at least 2 characters.' }
    }
    if (trimmed.length > 20) {
      return { success: false, error: 'Name must be 20 characters or fewer.' }
    }
    if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
      return { success: false, error: 'Name may only contain letters, spaces, and hyphens.' }
    }

    // ── Validate appearance ─────────────────────────────────────────────────
    const validSkinTones  = ['light', 'medium-light', 'medium', 'medium-dark', 'dark']
    const validHairColors = ['blonde', 'red', 'brown', 'black', 'auburn']
    const validHairStyles = ['straight', 'wavy', 'curly', 'coily', 'braided']
    const validEyeColors  = ['blue', 'green', 'brown', 'hazel', 'gray']

    if (
      !validSkinTones.includes(appearance.skinTone)   ||
      !validHairColors.includes(appearance.hairColor) ||
      !validHairStyles.includes(appearance.hairStyle) ||
      !validEyeColors.includes(appearance.eyeColor)
    ) {
      return { success: false, error: 'Invalid appearance selection.' }
    }

    // ── Look up book ────────────────────────────────────────────────────────
    const book = getBook(bookId)
    if (!book) {
      return { success: false, error: 'Book not found. Please go back and try again.' }
    }

    // ── Persist cart record ─────────────────────────────────────────────────
    const orderId = crypto.randomUUID()

    await cartStore.set({
      orderId,
      bookId,
      bookTitle:      book.title,
      childName:      trimmed,
      appearance,
      priceFormatted: book.priceFormatted,
      priceCents:     book.priceCents,
      createdAt:      new Date(),
      status:         'pending_payment',
    })

    return { success: true, orderId }
  } catch (err) {
    console.error('[addToCart]', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
