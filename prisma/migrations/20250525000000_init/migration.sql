-- CreateTable: initial StoryWeave schema
-- Includes all columns added across development phases:
--   Phase 6 : core order table with Stripe payment intent
--   Phase 7 : pdfS3Key  (cloud storage object key)
--   Phase 8 : customerEmail (transactional email)

CREATE TABLE "orders" (
    "id"                    TEXT NOT NULL,
    "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"             TIMESTAMP(3) NOT NULL,

    -- Book
    "bookId"                TEXT NOT NULL,
    "bookTitle"             TEXT NOT NULL,
    "priceFormatted"        TEXT NOT NULL,
    "priceCents"            INTEGER NOT NULL,

    -- Personalisation
    "childName"             TEXT NOT NULL,
    "skinTone"              TEXT NOT NULL,
    "hairColor"             TEXT NOT NULL,
    "hairStyle"             TEXT NOT NULL,
    "eyeColor"              TEXT NOT NULL,

    -- Payment & fulfilment
    "status"                TEXT NOT NULL DEFAULT 'pending_payment',
    "stripePaymentIntentId" TEXT,
    "customerEmail"         TEXT,

    -- Cloud storage
    "pdfS3Key"              TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orders_stripePaymentIntentId_idx" ON "orders"("stripePaymentIntentId");
