/**
 * HON Apparel — Email Receptionist Worker
 *
 * Cloudflare Email Worker that:
 *   1. Receives incoming emails to info@ / support@honapparel.com
 *   2. Generates a polite auto-reply using Cloudflare Workers AI (gpt-oss-20b)
 *   3. Forwards the original email to the team inbox
 *
 * Setup:
 *   - Bind Workers AI in wrangler.toml ([ai] binding)
 *   - Configure Email Routing to send info@/support@ to this Worker
 *   - Set FORWARD_TO in environment variables (your Gmail)
 */

// PostalMime parses incoming emails inside the Worker
import PostalMime from "postal-mime";

export default {
  async email(message, env, ctx) {
    const rawEmail = await streamToArrayBuffer(message.raw);
    const parser = new PostalMime();
    const parsed = await parser.parse(rawEmail);

    const senderAddress = message.from;
    const senderName = parsed.from?.name || senderAddress;
    const subject = parsed.subject || "(no subject)";
    const body = parsed.text || parsed.html || "";

    // Guard: skip auto-reply if this email is itself automated.
    // Checks standard headers that mail servers set on auto-generated messages.
    // This prevents double-replies and infinite reply loops.
    const headers = parsed.headers || [];
    const getHeader = (name) =>
      headers.find((h) => h.key.toLowerCase() === name.toLowerCase())?.value || "";

    const autoSubmitted = getHeader("auto-submitted");
    const precedence = getHeader("precedence");
    const xAutoResponseSuppress = getHeader("x-auto-response-suppress");

    const isAutomated =
      (autoSubmitted && autoSubmitted.toLowerCase() !== "no") ||
      /bulk|list|auto_reply|junk/i.test(precedence) ||
      xAutoResponseSuppress.length > 0 ||
      /no-?reply|mailer-daemon|postmaster|do-not-reply/i.test(senderAddress);

    // Guard: only auto-reply to emails arriving at the public inboxes.
    // If message.to is NOT info@ or support@, this is likely a forwarded
    // copy looping back through Cloudflare routing — skip the auto-reply.
    const publicInboxes = (env.PUBLIC_INBOXES || "info@honapparel.com,support@honapparel.com")
      .split(",")
      .map((a) => a.trim().toLowerCase());
    const recipientAddress = (message.to || "").toLowerCase();

    if (!publicInboxes.includes(recipientAddress)) {
      // Not a public inbox — this is a forwarded internal copy looping back
      // through Cloudflare routing. Drop it silently to break the loop.
      // Do NOT forward again or we recurse infinitely.
      return;
    }

    if (isAutomated) {
      // Automated email — forward to team but skip the auto-reply.
      const forwardTo = env.FORWARD_TO || "jonathan@honapparel.com";
      try { await message.forward(forwardTo); } catch (_) {}
      return;
    }

    // Truncate body to avoid excessive token usage
    const truncatedBody = body.slice(0, 1500);

    // Generate a polite acknowledgment reply using Workers AI
    let replyBody;
    try {
      replyBody = await generateReply(env, senderName, subject, truncatedBody);
    } catch (err) {
      console.error("AI reply generation failed, using fallback:", err);
      replyBody = getFallbackReply(senderName, subject, truncatedBody);
    }

    // Build the auto-reply email
    const replyMime = buildReplyMime({
      to: senderAddress,
      toName: senderName,
      from: message.to,              // reply from the address they wrote to
      subject: `Re: ${subject}`,
      body: replyBody,
      inReplyTo: parsed.messageId,
    });

    // Send the auto-reply — wrap in try/catch so a delivery failure doesn't
    // crash the worker (which would cause iCloud/Gmail to retry the original
    // email and trigger duplicate auto-replies).
    try {
      const replyMessage = new EmailMessage(message.to, senderAddress, replyMime);
      await message.reply(replyMessage);
    } catch (err) {
      console.error("Auto-reply send failed:", err);
    }

    // Forward original email to the team — also wrapped so a forward failure
    // doesn't crash the worker and trigger SMTP retries.
    const forwardTo = env.FORWARD_TO || "jonathan@honapparel.com";
    try { await message.forward(forwardTo); } catch (err) {
      console.error("Forward failed:", err);
    }
  },
};

/**
 * Generate a polite receptionist-style reply via Workers AI.
 */
async function generateReply(env, senderName, subject, body) {
  // Extract first name only for a more personal greeting
  const firstName = senderName.includes("@")
    ? senderName.split("@")[0]
    : senderName.split(" ")[0];

  const prompt = `You are a warm, professional customer service receptionist for HON Apparel, a faith-inspired athletic apparel brand. Write a brief, genuine acknowledgment reply to this customer email.

Rules:
- Address them by first name: "${firstName}"
- In 1 sentence, briefly reflect the specific topic or concern they raised (e.g. if they asked about an order, mention their order; if they asked about sizing, mention sizing) — do NOT make up details, just echo their topic back warmly
- Let them know their message has been passed to the team and someone will follow up shortly
- Keep the total reply to 3–5 sentences max
- Sign off as "The HON Apparel Team"
- Do NOT make up policies, pricing, timelines, or promises beyond a timely follow-up
- Do NOT include a subject line — just the email body
- Write in a tone that is warm, human, and brief — not corporate or robotic

Customer name: ${senderName}
Subject: ${subject}
Message:
${body}`;

  const response = await env.AI.run("@cf/openai/gpt-oss-20b", {
    messages: [
      { role: "system", content: "You are a helpful, concise customer service receptionist." },
      { role: "user", content: prompt },
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  return response.response || getFallbackReply(senderName, subject, body);
}

/**
 * Fallback reply if the AI model is unavailable.
 * Includes a light subject-aware touch so it doesn't feel fully generic.
 */
function getFallbackReply(senderName, subject = "", body = "") {
  const firstName = senderName.includes("@")
    ? senderName.split("@")[0]
    : senderName.split(" ")[0];

  // Detect common topics from subject/body to add one personal sentence
  const combined = (subject + " " + body).toLowerCase();
  let topicLine = "We've received your message and have passed it along to our team.";
  if (/order|tracking|ship|deliver/i.test(combined)) {
    topicLine = "We've received your message about your order and have passed it along to our team.";
  } else if (/size|sizing|fit|measurement/i.test(combined)) {
    topicLine = "We've received your sizing question and have passed it along to our team.";
  } else if (/return|exchange|refund/i.test(combined)) {
    topicLine = "We've received your return or exchange request and have passed it along to our team.";
  } else if (/wholesale|bulk|partner|collab/i.test(combined)) {
    topicLine = "We've received your partnership or wholesale inquiry and have passed it along to our team.";
  }

  return `Hi ${firstName},

Thanks for reaching out to HON Apparel — we appreciate you taking the time to connect with us.

${topicLine} Someone will follow up with you shortly.

Warm regards,
The HON Apparel Team`;
}

/**
 * Build a minimal RFC 5322 MIME message for the reply.
 */
function buildReplyMime({ to, toName, from, subject, body, inReplyTo }) {
  const boundary = "----=_Part_" + Date.now();
  const date = new Date().toUTCString();

  return [
    `From: HON Apparel <${from}>`,
    `To: ${toName} <${to}>`,
    `Subject: ${subject}`,
    `Date: ${date}`,
    inReplyTo ? `In-Reply-To: ${inReplyTo}` : "",
    inReplyTo ? `References: ${inReplyTo}` : "",
    `MIME-Version: 1.0`,
    `Auto-Submitted: auto-replied`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    body,
  ]
    .filter(Boolean)
    .join("\r\n");
}

/**
 * Convert a ReadableStream to an ArrayBuffer.
 */
async function streamToArrayBuffer(stream) {
  const chunks = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const totalLength = chunks.reduce((acc, c) => acc + c.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  }
  return result.buffer;
}
