# HON Apparel — Claude Code Guidelines

## Project Overview

HON Apparel is a static HTML/CSS/JS e-commerce site hosted on GitHub Pages.
All payment processing, customer data, and order management are handled by
Shopify via the Buy Button SDK. This repo contains NO backend logic.

---

## Security & Privacy Rules (MANDATORY)

These rules are non-negotiable. Claude MUST follow them at all times.

### 1. Never Commit Secrets or Credentials

- **No API secret keys** (Shopify Admin API, payment processor secrets, etc.)
- **No passwords, auth tokens, or session keys**
- **No database connection strings**
- **No private SSH keys or certificates**
- **No `.env` files or environment variable files containing real values**

The following are SAFE to include in client-side code (they are designed to be public):

- Shopify **Storefront Access Token** (read-only, client-facing)
- Google Analytics / GA4 Measurement IDs (e.g., `G-XXXXXXXXXX`)
- ConvertKit or Mailchimp embed codes and public form IDs

### 2. Customer Data Protection

- **Never store customer data** (names, emails, addresses, payment info) in this repo
- **Never log or capture customer data** to local files or console in production code
- All customer data collection must go through third-party services (Shopify, ConvertKit, Mailchimp)
- Forms must submit to external service endpoints, never to local files or inline storage

### 3. Payment Security

- **All payment processing must go through Shopify** — never build custom payment flows
- Never include `<input type="credit-card">` or similar payment capture fields
- Never reference or include PCI-sensitive data in any file
- Cart and checkout flows must redirect to or embed Shopify's hosted checkout

### 4. File Safety

- **`.gitignore` must exist** and must cover at minimum:
  - `.env`, `.env.*`
  - `*.key`, `*.pem`, `*.p12`
  - `node_modules/`
  - `.DS_Store`, `Thumbs.db`
  - Any file containing `SECRET`, `PRIVATE`, or `PASSWORD` in its name
- Never commit IDE config files that may contain tokens (`.vscode/settings.json` with secrets, etc.)

### 5. Third-Party Scripts

- Only load external scripts from trusted, well-known CDNs and services
- Allowed external sources: Shopify, Google Analytics/Tag Manager, ConvertKit, Mailchimp, Google Fonts, Cloudflare
- Do not add inline scripts from unknown or unvetted sources
- Do not add tracking pixels or scripts without the owner's explicit approval

---

## Pre-Commit Security Checklist (REQUIRED)

**Before every commit, Claude MUST manually verify ALL of the following.**
Do not skip this checklist. Do not assume previous compliance.

1. **Scan all staged files** for hardcoded secrets:
   - Search for patterns: API keys, tokens, passwords, connection strings
   - Search for strings matching: `sk_live`, `sk_test`, `Bearer `, `Authorization:`, `password`, `secret`, `private_key`
   - Verify no `.env` or credential files are staged

2. **Verify `.gitignore` exists** and covers the required patterns listed above

3. **Check all `<form>` elements** — confirm `action` attributes point to external services, not local endpoints or `#` with JS that stores data locally

4. **Check all `<script>` tags** — confirm `src` attributes reference only approved external sources listed above

5. **Check JavaScript files** for:
   - `fetch()` or `XMLHttpRequest` calls to unknown endpoints
   - `localStorage` or `sessionStorage` usage that stores customer PII
   - `console.log()` statements that output sensitive data
   - Inline credentials or tokens that are not Storefront/public tokens

6. **Check for customer data leaks** — no email addresses, names, or personal data hardcoded in HTML/JS files (placeholder/example data is OK if clearly fake)

7. **Report findings** to the user before completing the commit. If any violation is found, **block the commit** and explain the issue.

---

## General Development Guidelines

- This is a static site — do not introduce server-side frameworks or backends
- Preserve the existing design language (gold/black/white palette, serif + sans-serif typography)
- Keep file structure flat and simple: `css/`, `js/`, `img/`, `blog/`, `faq/`
- Test changes across mobile and desktop viewports before committing
- Write descriptive commit messages that explain the "why" not just the "what"
