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

    // Truncate body to avoid excessive token usage
    const truncatedBody = body.slice(0, 1500);

    // Generate a polite acknowledgment reply using Workers AI
    let replyBody;
    try {
      replyBody = await generateReply(env, senderName, subject, truncatedBody);
    } catch (err) {
      console.error("AI reply generation failed, using fallback:", err);
      replyBody = getFallbackReply(senderName);
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

    // Send the auto-reply
    const replyMessage = new EmailMessage(message.to, senderAddress, replyMime);
    await message.reply(replyMessage);

    // Forward original email to the team
    const forwardTo = env.FORWARD_TO || "jonathan@honapparel.com";
    await message.forward(forwardTo);
  },
};

/**
 * Generate a polite receptionist-style reply via Workers AI.
 */
async function generateReply(env, senderName, subject, body) {
  const prompt = `You are a polite, professional customer service receptionist for HON Apparel, a faith-inspired athletic apparel brand. A customer has emailed and you need to write a brief, warm acknowledgment reply.

Rules:
- Thank them for reaching out
- Acknowledge their inquiry without attempting to resolve it
- Let them know the matter has been raised with the team and someone will follow up shortly
- Keep it to 3-5 sentences
- Sign off as "The HON Apparel Team"
- Do NOT make up any specific information, policies, or promises beyond a timely follow-up
- Do NOT include a subject line, just the body of the reply

Customer name: ${senderName}
Subject: ${subject}
Message excerpt:
${body}`;

  const response = await env.AI.run("@cf/openai/gpt-oss-20b", {
    messages: [
      { role: "system", content: "You are a helpful, concise customer service receptionist." },
      { role: "user", content: prompt },
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  return response.response || getFallbackReply(senderName);
}

/**
 * Fallback reply if the AI model is unavailable.
 */
function getFallbackReply(senderName) {
  const name = senderName.split("@")[0]; // strip email domain if no display name
  return `Dear ${name},

Thank you for reaching out to HON Apparel. We have received your message and your inquiry has been raised with our team. A member of our staff will follow up with you shortly.

We appreciate your patience and look forward to assisting you.

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
