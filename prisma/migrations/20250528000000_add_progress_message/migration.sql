-- Add progressMessage column for live AI illustration progress updates
-- Written by the Render PDF microservice during generation;
-- read by the frontend via the /api/orders/[orderId]/status polling endpoint.

ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "progressMessage" TEXT;
