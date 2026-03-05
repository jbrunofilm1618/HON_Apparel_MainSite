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
3. Set the action to **"Send to a Worker"** and select **hon-email-receptionist**
4. **IMPORTANT:** Make sure each route has ONLY this one action. If there is also a "Forward to email" action on the same route, remove it — the worker handles forwarding internally. Two actions = two emails to the customer.
5. Save

> **After any code change, you must redeploy** (`npm run deploy`) for the change
> to take effect on Cloudflare. Git commits alone do not update the live worker.

## Configuration

Edit `wrangler.toml` to change:

- `FORWARD_TO` — the email address that receives forwarded emails

## Fallback

If the AI model is unavailable, the worker sends a pre-written polite
acknowledgment instead of an AI-generated one. Customers always get a reply.
