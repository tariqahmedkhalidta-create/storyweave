# ── Stage 1: base image with Chrome pre-installed ────────────────────────────
# ghcr.io/puppeteer/puppeteer ships with a compatible Chrome binary and sets
# PUPPETEER_EXECUTABLE_PATH so Puppeteer uses it automatically.
FROM ghcr.io/puppeteer/puppeteer:22 AS base

# ── Stage 2: install dependencies ────────────────────────────────────────────
USER root
WORKDIR /app

# Copy pdf-service package manifest
COPY pdf-service/package*.json ./pdf-service/

# Install pdf-service deps (includes tsx + puppeteer + aws-sdk)
RUN cd pdf-service && npm ci --omit=dev 2>/dev/null || npm ci

# ── Stage 3: copy source ──────────────────────────────────────────────────────
# Copy the parent src/ directory so relative imports resolve correctly
COPY src/ ./src/

# Copy the pdf-service source
COPY pdf-service/ ./pdf-service/

# Fix file ownership for the pptruser account (required for Puppeteer sandbox)
RUN chown -R pptruser:pptruser /app

# ── Runtime ───────────────────────────────────────────────────────────────────
USER pptruser

ENV NODE_ENV=production
ENV PORT=8080
# Allow imports from /app/src/ to resolve modules installed in pdf-service/node_modules/
ENV NODE_PATH=/app/pdf-service/node_modules

# tsx runs TypeScript directly (no separate build step).
# --tsconfig resolves the @/ path aliases defined in pdf-service/tsconfig.json.
WORKDIR /app/pdf-service
CMD ["node_modules/.bin/tsx", "--tsconfig", "tsconfig.json", "server.ts"]
