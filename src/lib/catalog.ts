/**
 * StoryWeave book catalogue.
 *
 * Each entry drives three things:
 *   1. A card on the /  (home) browse page
 *   2. The /customize/[bookId] personalisation tool
 *   3. The order record stored in the database (bookTitle, priceCents)
 *
 * To add a new book: append an entry here and create its story pages in
 * src/lib/story-templates.ts.  No other files need touching.
 */

export interface BookEntry {
  /** Slug used as the URL param and DB foreign key */
  id:             string
  title:          string
  /** One-line marketing hook shown on the card */
  tagline:        string
  /** 1–2 sentence description for the card flip / tooltip */
  description:    string
  /** E.g. ['Magic', 'Friendship', 'Bravery'] */
  themes:         string[]
  ageRange:       string
  pageCount:      number
  priceFormatted: string
  priceCents:     number
  /** CSS gradient stop colours for the cover illustration */
  coverFrom:      string
  coverTo:        string
  /** Accent colour used for text on the cover */
  coverAccent:    string
  /** Large emoji shown on the cover tile */
  coverEmoji:     string
}

export const BOOK_CATALOG: BookEntry[] = [
  {
    id:             'enchanted-forest',
    title:          'The Enchanted Forest',
    tagline:        'A magical quest through a woodland of wonders',
    description:    'Deep in an ancient forest full of talking animals and hidden magic, one brave child holds the key to returning the lost star to the sky.',
    themes:         ['Magic', 'Friendship', 'Bravery'],
    ageRange:       '3–8',
    pageCount:      24,
    priceFormatted: '$24.99',
    priceCents:     2499,
    coverFrom:      '#5b21b6',
    coverTo:        '#7c3aed',
    coverAccent:    '#ddd6fe',
    coverEmoji:     '🌿',
  },
  {
    id:             'starlight-adventure',
    title:          'A Starlight Adventure',
    tagline:        'Blast off on a journey across the cosmos',
    description:    'When a mysterious signal comes from the far edge of the galaxy, one young astronaut answers the call — and discovers something truly incredible.',
    themes:         ['Space', 'Discovery', 'Courage'],
    ageRange:       '4–9',
    pageCount:      24,
    priceFormatted: '$24.99',
    priceCents:     2499,
    coverFrom:      '#1e3a8a',
    coverTo:        '#1d4ed8',
    coverAccent:    '#bfdbfe',
    coverEmoji:     '🚀',
  },
  {
    id:             'ocean-of-dreams',
    title:          'The Ocean of Dreams',
    tagline:        'Dive into an underwater world of wonder',
    description:    'Beneath the shimmering surface lies a world of colour, mystery, and friendship — and the ocean needs its bravest little explorer.',
    themes:         ['Ocean', 'Nature', 'Wonder'],
    ageRange:       '3–7',
    pageCount:      24,
    priceFormatted: '$24.99',
    priceCents:     2499,
    coverFrom:      '#0e7490',
    coverTo:        '#0891b2',
    coverAccent:    '#a5f3fc',
    coverEmoji:     '🐚',
  },
  {
    id:             'dragon-keeper',
    title:          'The Dragon Keeper',
    tagline:        'Every dragon needs a truly brave friend',
    description:    'On a mountain where no one dares to climb, a lonely dragon has been waiting for the one child brave enough to become its friend.',
    themes:         ['Dragons', 'Kindness', 'Adventure'],
    ageRange:       '4–9',
    pageCount:      24,
    priceFormatted: '$24.99',
    priceCents:     2499,
    coverFrom:      '#7f1d1d',
    coverTo:        '#b91c1c',
    coverAccent:    '#fecaca',
    coverEmoji:     '🐉',
  },
  {
    id:             'time-traveller',
    title:          'The Time Traveller',
    tagline:        'One child. All of history. Infinite adventures.',
    description:    'A mysterious golden watch, a swirl of light — and suddenly our hero is face-to-face with dinosaurs, knights, and the builders of the pyramids.',
    themes:         ['History', 'Time Travel', 'Curiosity'],
    ageRange:       '5–10',
    pageCount:      24,
    priceFormatted: '$24.99',
    priceCents:     2499,
    coverFrom:      '#78350f',
    coverTo:        '#b45309',
    coverAccent:    '#fde68a',
    coverEmoji:     '⏳',
  },
]

/**
 * Look up a single book by its slug.
 * Returns undefined when the id is not in the catalogue.
 */
export function getBook(id: string): BookEntry | undefined {
  return BOOK_CATALOG.find(b => b.id === id)
}
