interface Env {
    RESEND_API_KEY: string
}

interface ReservationItem {
    name: string
    size: string
    color: string
    qty: number
}

function sanitize(val: unknown): string {
    if (typeof val !== 'string') return ''
    return val.trim().slice(0, 500)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function jsonResponse(ok: boolean, status = 200): Response {
    return new Response(JSON.stringify({ ok }), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
}

async function sendEmail(
    apiKey: string,
    from: string,
    to: string,
    subject: string,
    html: string,
    replyTo?: string,
): Promise<boolean> {
    const payload: Record<string, string> = { from, to, subject, html }
    if (replyTo) payload.reply_to = replyTo
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    return res.ok
}

export async function onRequestPost({
    request,
    env,
}: {
    request: Request
    env: Env
}): Promise<Response> {
    if (!env.RESEND_API_KEY) return jsonResponse(false, 500)

    let data: Record<string, unknown>
    try {
        data = (await request.json()) as Record<string, unknown>
    } catch {
        return jsonResponse(false, 400)
    }

    const customerName = sanitize(data.customer_name)
    const rawEmail = typeof data.customer_email === 'string' ? data.customer_email.trim() : ''
    if (!customerName || !rawEmail || !isValidEmail(rawEmail)) {
        return jsonResponse(false, 400)
    }
    const customerEmail = rawEmail
    const message = sanitize(data.message)

    const items: ReservationItem[] = []
    if (Array.isArray(data.items)) {
        for (const item of data.items as Record<string, unknown>[]) {
            const name = sanitize(item.product_name)
            if (!name) continue
            const size  = sanitize(item.size)
            const color = sanitize(item.color)
            const qty   = Math.max(1, Math.min(99, parseInt(String(item.quantity ?? '1'), 10) || 1))
            items.push({ name, size, color, qty })
        }
    } else {
        const name = sanitize(data.product_name)
        if (name) {
            const size  = sanitize(data.size)
            const color = sanitize(data.color)
            const qty   = Math.max(1, Math.min(99, parseInt(String(data.quantity ?? '1'), 10) || 1))
            items.push({ name, size, color, qty })
        }
    }

    if (items.length === 0) return jsonResponse(false, 400)

    const siteName   = 'Amics del Drac de Vilafranca del Penedès'
    const siteUrl    = 'https://www.dracdevilafranca.com'
    const toAssoc    = 'drac@dracdevilafranca.com'
    const fromNoreply = `${siteName} <noreply@dracdevilafranca.com>`
    const fromAssoc  = `${siteName} <${toAssoc}>`

    let itemRowsAssoc   = ''
    let itemRowsConfirm = ''
    for (const item of items) {
        const details     = [item.color, item.size].filter(Boolean).join(' · ')
        const detailsHtml = details ? ` <span style="color:#999">(${details})</span>` : ''
        itemRowsAssoc   += `<tr><td style="padding:4px 12px;color:#e5e5e5">${item.name}${detailsHtml}</td><td style="padding:4px 12px;color:#999">×${item.qty}</td></tr>`
        itemRowsConfirm += `<p style="margin:3px 0">${item.name}${details ? ` (${details})` : ''} ×${item.qty}</p>`
    }
    const messageRow = message
        ? `<tr><td style="padding:6px 12px;color:#999;vertical-align:top">Missatge</td><td style="padding:6px 12px;color:#e5e5e5">${message}</td></tr>`
        : ''

    const assocSubject = items.length === 1
        ? `Nova reserva: ${items[0].name}`
        : `Nova reserva de cistella (${items.length} articles)`

    const assocHtml = `<!DOCTYPE html><html lang="ca"><body style="margin:0;padding:0;background:#0f0f0f;font-family:sans-serif">
<div style="max-width:520px;margin:32px auto;background:#1a1a1a;border:1px solid #333;border-radius:10px;overflow:hidden">
  <div style="padding:20px 24px;background:#c41e3a">
    <h2 style="margin:0;color:#fff;font-size:18px">Nova reserva · ${siteName}</h2>
  </div>
  <div style="padding:24px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:6px 12px;color:#999" colspan="2"><strong style="color:#e5e5e5">Articles</strong></td></tr>
      ${itemRowsAssoc}
      <tr><td style="padding:6px 12px;color:#999">Nom</td><td style="padding:6px 12px;color:#e5e5e5">${customerName}</td></tr>
      <tr><td style="padding:6px 12px;color:#999">Correu</td><td style="padding:6px 12px"><a href="mailto:${customerEmail}" style="color:#c41e3a">${customerEmail}</a></td></tr>
      ${messageRow}
    </table>
  </div>
</div>
</body></html>`

    const confirmSubject = `Confirmació de reserva · ${siteName}`

    const confirmHtml = `<!DOCTYPE html><html lang="ca"><body style="margin:0;padding:0;background:#0f0f0f;font-family:sans-serif">
<div style="max-width:520px;margin:32px auto;background:#1a1a1a;border:1px solid #333;border-radius:10px;overflow:hidden">
  <div style="padding:20px 24px;background:#c41e3a">
    <h2 style="margin:0;color:#fff;font-size:18px">Confirmació de reserva</h2>
  </div>
  <div style="padding:24px;color:#e5e5e5;line-height:1.6">
    <p>Hola <strong>${customerName}</strong>,</p>
    <p>Hem rebut la teva reserva. Ens posarem en contacte amb tu en breu per confirmar la disponibilitat i el pagament.</p>
    <div style="background:#111;border:1px solid #333;border-radius:8px;padding:16px;margin:20px 0">
      ${itemRowsConfirm}
    </div>
    <p style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:12px 16px;font-size:13px;color:#999">
      📦 <strong style="color:#e5e5e5">Recollida en mà</strong> · No fem enviaments. Els articles s'han de recollir a Vilafranca del Penedès. Us avisarem quan estiguin llestos.
    </p>
    <p>Gràcies per la teva reserva!</p>
    <hr style="border:none;border-top:1px solid #333;margin:24px 0">
    <p style="color:#666;font-size:13px;margin:0">${siteName} · <a href="${siteUrl}" style="color:#c41e3a">dracdevilafranca.com</a></p>
  </div>
</div>
</body></html>`

    // Send both emails concurrently — association notification and customer confirmation
    const [assocOk] = await Promise.all([
        sendEmail(
            env.RESEND_API_KEY,
            fromNoreply,
            toAssoc,
            assocSubject,
            assocHtml,
            `${customerName} <${customerEmail}>`,
        ),
        sendEmail(
            env.RESEND_API_KEY,
            fromAssoc,
            customerEmail,
            confirmSubject,
            confirmHtml,
        ),
    ])

    return jsonResponse(assocOk)
}
