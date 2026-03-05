# HON Apparel — Email Receptionist Worker

AI-powered auto-reply worker for info@ and support@ emails.
Uses Cloudflare Workers AI (gpt-oss-20b) to generate polite acknowledgment
replies and forwards the original email to the team.

## How It Works

1. Customer emails `info@honapparel.com` or `support@honapparel.com`
2. Cloudflare Email Routing sends the email to this Worker
3. Worker uses AI to generate a warm, personalized acknowledgment
4. Auto-reply is sent back to the customer
5. Original email is forwarded to `jonathan@honapparel.com`

## Deployment Steps

### Prerequisites

- Node.js 18+ installed
- Cloudflare account with Workers AI enabled (free tier includes 10,000 AI requests/day)

### 1. Install dependencies

```bash
cd workers/email-receptionist
npm install
```

### 2. Authenticate with Cloudflare

```bash
npx wrangler login
```

### 3. Deploy the worker

```bash
npm run deploy
```

### 4. Configure Email Routing

1. Go to **Cloudflare Dashboard** → your domain → **Email** → **Email Routing**
2. Under **Routes**, edit (or create) the routes for:
   - `info@honapparel.com`
   - `support@honapparel.com`
3. Change the action from "Forward to" to **"Send to a Worker"**
4. Select **hon-email-receptionist** from the worker dropdown
5. Save

Emails will now get an AI auto-reply AND be forwarded to your Gmail.

## Configuration

Edit `wrangler.toml` to change:

- `FORWARD_TO` — the email address that receives forwarded emails

## Fallback

If the AI model is unavailable, the worker sends a pre-written polite
acknowledgment instead of an AI-generated one. Customers always get a reply.
