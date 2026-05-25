/**
 * Transactional email — powered by Resend.
 *
 * https://resend.com  (free tier: 3 000 emails / month)
 *
 * Configuration (env vars — see .env.local.example):
 *   RESEND_API_KEY  — your Resend API key (starts with re_)
 *   EMAIL_FROM      — the "from" address (e.g. StoryWeave <books@yourdomain.com>)
 *                     Use "onboarding@resend.dev" for local testing before you
 *                     verify a domain.
 *   NEXT_PUBLIC_APP_URL — full origin (e.g. https://storyweave.com).
 *                         Used to build the download link in the "book ready" email.
 *                         Falls back to VERCEL_URL (set automatically on Vercel)
 *                         then http://localhost:3000.
 *
 * Graceful degradation:
 *   When RESEND_API_KEY is absent `isConfigured()` returns false and all
 *   send calls are no-ops so the app works in development without an email
 *   account.
 */

import { Resend } from 'resend'

// ── Lazy singleton ────────────────────────────────────────────────────────────

let _resend: Resend | null = null

function getClient(): Resend {
  if (_resend) return _resend
  _resend = new Resend(process.env.RESEND_API_KEY!)
  return _resend
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function appUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  if (process.env.VERCEL_URL)          return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

function fromAddress(): string {
  return process.env.EMAIL_FROM ?? 'StoryWeave <onboarding@resend.dev>'
}

// ── Shared HTML shell ─────────────────────────────────────────────────────────

function htmlShell(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>StoryWeave</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:560px;background:#ffffff;border-radius:16px;
                 box-shadow:0 1px 3px rgba(0,0,0,0.08);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#6d28d9);
                       padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:24px;font-weight:800;color:#ffffff;
                         letter-spacing:-0.5px;">✦ StoryWeave</p>
              <p style="margin:6px 0 0;font-size:13px;color:#ddd6fe;">
                Personalised children's storybooks
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;
                       border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
                You received this email because you placed an order with StoryWeave.<br>
                Questions? Reply to this email and we'll be happy to help.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ── Email templates ───────────────────────────────────────────────────────────

function orderConfirmationHtml(params: {
  childName: string
  bookTitle: string
  orderId:   string
}): string {
  const { childName, bookTitle, orderId } = params
  const shortId = orderId.slice(0, 8).toUpperCase()

  return htmlShell(`
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#7c3aed;
               text-transform:uppercase;letter-spacing:1px;">
      Order confirmed
    </p>
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#0f172a;
                line-height:1.25;">
      We're creating ${childName}'s book! 🎉
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Thank you for your order. We're personalising <strong>${bookTitle}</strong>
      and rendering it just for ${childName}. This usually takes about 30 seconds.
      We'll email you again the moment it's ready to download.
    </p>

    <!-- Order details card -->
    <table width="100%" cellpadding="0" cellspacing="0"
      style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;">
      <tr>
        <td style="font-size:11px;font-weight:700;color:#94a3b8;
                   text-transform:uppercase;letter-spacing:1px;padding-bottom:12px;">
          Order Details
        </td>
      </tr>
      <tr>
        <td style="font-size:14px;color:#475569;padding:4px 0;">
          <strong style="color:#0f172a;">Book:</strong> ${bookTitle}
        </td>
      </tr>
      <tr>
        <td style="font-size:14px;color:#475569;padding:4px 0;">
          <strong style="color:#0f172a;">Starring:</strong> ${childName}
        </td>
      </tr>
      <tr>
        <td style="font-size:14px;color:#475569;padding:4px 0;">
          <strong style="color:#0f172a;">Order #:</strong> ${shortId}
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.5;">
      Keep an eye on your inbox — your personalised PDF will arrive shortly.
    </p>
  `)
}

function bookReadyHtml(params: {
  childName:   string
  bookTitle:   string
  orderId:     string
  downloadUrl: string
}): string {
  const { childName, bookTitle, downloadUrl } = params

  return htmlShell(`
    <!-- Success icon -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-flex;align-items:center;justify-content:center;
                  width:56px;height:56px;border-radius:50%;
                  background:#dcfce7;font-size:28px;">
        ✓
      </div>
    </div>

    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#16a34a;
               text-transform:uppercase;letter-spacing:1px;text-align:center;">
      Your book is ready
    </p>
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#0f172a;
                line-height:1.25;text-align:center;">
      ${bookTitle} is here! 📖
    </h1>
    <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;
               text-align:center;">
      ${childName}'s personalised storybook has been generated and is ready
      to download. Click the button below to save your PDF.
    </p>

    <!-- Download button -->
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${downloadUrl}"
        style="display:inline-block;padding:16px 36px;
               background:#16a34a;color:#ffffff;
               font-size:16px;font-weight:700;text-decoration:none;
               border-radius:12px;letter-spacing:0.2px;">
        ⬇ Download Your Book (PDF)
      </a>
    </div>

    <!-- Note -->
    <table width="100%" cellpadding="0" cellspacing="0"
      style="background:#f0fdf4;border:1px solid #bbf7d0;
             border-radius:10px;padding:14px 16px;margin-bottom:8px;">
      <tr>
        <td style="font-size:13px;color:#166534;line-height:1.5;">
          <strong>Tip:</strong> Save the PDF to your device so you can print
          it or read it anytime — the download link expires after 5 minutes
          but you can always visit your order page for a fresh link.
        </td>
      </tr>
    </table>
  `)
}

// ── Public API ────────────────────────────────────────────────────────────────

export const emailService = {

  /** Returns true when RESEND_API_KEY is set. */
  isConfigured(): boolean {
    return Boolean(process.env.RESEND_API_KEY)
  },

  /**
   * Sent immediately after payment_intent.succeeded.
   * Tells the customer their order is confirmed and the book is being created.
   */
  async sendOrderConfirmation(params: {
    to:        string
    childName: string
    bookTitle: string
    orderId:   string
  }): Promise<void> {
    if (!this.isConfigured()) {
      console.log('[email] Not configured — skipping order confirmation to', params.to)
      return
    }

    const { error } = await getClient().emails.send({
      from:    fromAddress(),
      to:      params.to,
      subject: `Your StoryWeave order for ${params.childName} is confirmed! ✦`,
      html:    orderConfirmationHtml(params),
    })

    if (error) {
      // Log but don't throw — email failure must never block the payment flow
      console.error('[email] Failed to send order confirmation:', error)
    } else {
      console.log(`[email] ✓ Order confirmation sent to ${params.to}`)
    }
  },

  /**
   * Sent after the PDF has been successfully generated and uploaded.
   * Includes a direct download link.
   */
  async sendBookReady(params: {
    to:        string
    childName: string
    bookTitle: string
    orderId:   string
  }): Promise<void> {
    if (!this.isConfigured()) {
      console.log('[email] Not configured — skipping book-ready email to', params.to)
      return
    }

    const downloadUrl = `${appUrl()}/api/download/${params.orderId}`

    const { error } = await getClient().emails.send({
      from:    fromAddress(),
      to:      params.to,
      subject: `${params.bookTitle} starring ${params.childName} is ready to download! 📖`,
      html:    bookReadyHtml({ ...params, downloadUrl }),
    })

    if (error) {
      console.error('[email] Failed to send book-ready email:', error)
    } else {
      console.log(`[email] ✓ Book-ready email sent to ${params.to}`)
    }
  },
}
