# HON — Claude Code Build Handoff

> **Athletic Apparel for the Inner Person**
> February 2026 | Version 1.0

---

## YOUR MISSION

Build a continuous-scroll static website for HON Athletic Apparel. The site is hosted on GitHub Pages, uses vanilla HTML/CSS/JS (no framework, no build step), and will integrate Shopify Buy Button for commerce. The design follows apple.com's full-viewport section approach — cinematic, minimal, scroll-driven storytelling.

Build everything EXCEPT the Shopify embed codes. Leave placeholder `<div>` containers where the Buy Buttons will go. The owner (Arthur) will paste those in separately.

---

## TECH STACK

| Parameter | Value |
|-----------|-------|
| Domain | honapparel.com |
| Hosting | GitHub Pages (static files, free) |
| Commerce | Shopify Buy Button embeds (JS snippets in placeholder divs) |
| Analytics | Google Analytics 4 (GA4) — placeholder measurement ID |
| Framework | None. Vanilla HTML, CSS, JS. No build step. |
| CSS | Single file, mobile-first, CSS custom properties for brand tokens |
| JS | Intersection Observer for scroll animations, scroll-spy for nav |
| Fonts | Georgia (system serif), Uncial Antiqua (Google Fonts — Greek/brand text) |
| Design language | Apple.com-style: full-viewport sections, cinematic scroll reveals, minimal |

---

## BRAND DESIGN TOKENS

Use CSS custom properties. Define once, use everywhere.

```css
:root {
  --color-dark: #162B22;
  --color-gold: #C49B2A;
  --color-sage: #6B8F71;
  --color-sand: #F5F0E8;
  --color-slate: #4A5568;
  --color-sand-dark: #D4C5A9;
  --color-white: #FAFAF8;
  --font-serif: Georgia, 'Times New Roman', serif;
  --font-uncial: 'Uncial Antiqua', cursive;
  --max-content: 680px;
  --max-wide: 1200px;
  --transition-base: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 1.0s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## FILE STRUCTURE

```
hon-website/
├── index.html              # Homepage (9-scene continuous scroll)
├── CNAME                   # Contains: honapparel.com
├── sitemap.xml             # All pages listed
├── robots.txt              # Allow all
├── css/
│   └── style.css           # All styles, mobile-first
├── js/
│   ├── main.js             # Scroll animations, nav spy, accordion
│   └── shopify-buy.js      # Placeholder for Buy Button init + GA4 hooks
├── img/
│   ├── og-image.jpg        # 1200x630 Open Graph image (placeholder)
│   └── favicon.ico         # HON mark (placeholder)
├── blog/
│   ├── index.html          # Blog list page
│   ├── what-does-hon-mean.html
│   ├── chi-rho-monogram.html
│   └── gym-devotional-time.html
└── faq/
    └── index.html          # Accordion + JSON-LD schema
```

---

## NAVIGATION

Fixed/sticky nav bar. Transparent over hero → transitions to solid dark (#0F1B2D) with backdrop-filter blur on scroll.

- **Left:** HŌN wordmark in gold, var(--font-uncial). Links to top of page (smooth scroll).
- **Right (desktop):** Story · Collection · Journal · Subscribe — anchor links with scroll-spy active states
- **Right (mobile):** Hamburger menu icon + Cart icon (for future Shopify cart toggle)
- **Scroll behavior:** `Story` → Scene 2, `Collection` → Scene 6, `Journal` → /blog/, `Subscribe` → Scene 8
- **Active state:** Use Intersection Observer scroll-spy. Highlight the nav item whose section is currently in viewport.
- **Transition:** Nav background goes from `transparent` to `rgba(15, 27, 45, 0.95)` with `backdrop-filter: blur(10px)` when `scrollY > 80px`.

---

## HOMEPAGE: 9-SCENE CONTINUOUS SCROLL

Each scene is a `<section>` with `min-height: 100vh`. Content centered vertically and horizontally using flexbox or grid. All animations trigger via Intersection Observer with `threshold: 0.15`. Once triggered, animations stay — no reverse on scroll-up.

Each section gets an `id` for anchor navigation: `#hero`, `#name`, `#difference`, `#pillars`, `#mission`, `#collection`, `#journal`, `#subscribe`, `#footer`.

### Scene 1: Hero
- **ID:** `#hero`
- **Background:** var(--color-dark), full viewport
- **Content (centered):**
  - Headline: **"Athletic Apparel for the Inner Person"** — white, large serif, 48–72px responsive
  - Subhead: *"Gymwear rooted in the earliest traditions of the Christian faith."* — gold, 20–24px
  - CTA Button: **"Shop the Collection"** — gold bg (#C49B2A), dark text (#0F1B2D), serif font, rounded corners. Smooth-scrolls to `#collection`.
  - Secondary link: "Scroll to explore ↓" — subtle white/50% opacity, animated bouncing arrow, anchors to `#name`
- **Animation:** Staggered fade-in on page load. Headline at 0.3s, subhead at 0.6s, CTA at 0.9s. Each element fades from `opacity: 0; transform: translateY(20px)` to `opacity: 1; transform: translateY(0)`.

### Scene 2: The Name
- **ID:** `#name`
- **Background:** var(--color-sand)
- **Content:**
  - Large Greek: **ὁ ὤν** — Uncial Antiqua, 80–120px, gold
  - Pronunciation: *"ho ōn"* — italic, slate, 16px
  - Reveal line: **"I AM WHO I AM."** — dark, Georgia bold, 28–36px
  - Body: "The Greek text of God's self-revelation to Moses at the burning bush. Exodus 3:14 in the Septuagint. Before denominations. Before divisions. The oldest surviving declaration of identity in the Judeo-Christian tradition. That's our name." — max-width 600px, centered, slate
- **Animation:** Sequential reveal on scroll-enter. Greek fades up, then pronunciation (0.3s delay), then "I AM WHO I AM" (0.6s), then body (0.9s).

### Scene 3: The Difference
- **ID:** `#difference`
- **Background:** var(--color-dark)
- **Content:**
  - Eyebrow: "NOT ANOTHER CHRISTIAN T-SHIRT" — gold, letter-spaced 3px, 12px uppercase
  - Headline: **"We don't signal your faith. We deepen it."** — white, 32–44px
  - Three columns (desktop: side-by-side, mobile: stacked):
    - **Col 1:** "Rooted in Antiquity" — "Symbols from pre-schism manuscripts. The earliest visual language of the faith, recovered and recontextualized."
    - **Col 2:** "Built for the Gym" — "Premium heavyweight fabrics. Considered construction. Designed for people who train, not just people who post about it."
    - **Col 3:** "More Than Apparel" — "Every piece ships with a devotional card. Historical context. Scripture. A reason to look twice at what you're wearing."
  - Each column has a thin gold top border as a decorative element
- **Animation:** Eyebrow+headline fade in, then columns stagger left-to-right with 0.2s delay each.

### Scene 4: Five Pillars
- **ID:** `#pillars`
- **Background:** var(--color-sand)
- **Content:**
  - Eyebrow: "WHAT WE STAND ON" — gold, letter-spaced
  - Headline: **"Five Pillars"** — dark, 32–44px
  - Each pillar is a block with Roman numeral + title + one-line description:
    - **I. People First** — "Every decision asks one question: does this serve the person wearing it?"
    - **II. Commitment to Jesus** — "Not as a slogan. As a practice. We show up on the hard days."
    - **III. Educational** — "Every symbol has a story. We connect historical findings to the Bible so you can understand where your faith has been."
    - **IV. Truth and Authenticity** — "We're not perfect and we don't pretend to be. We're vulnerable about our struggles because that's where Christ meets us."
    - **V. Community** — "Iron sharpens iron. This brand exists to connect people who take both training and faith seriously."
- **Animation:** Headline fades in, then each pillar fades in sequentially with 0.15s gaps.

### Scene 5: The Mission
- **ID:** `#mission`
- **Background:** var(--color-dark)
- **Content (centered, dramatic):**
  - Quote: **"Jesus loves you exactly as you are. And He loves you too much to leave you there."** — white, large serif, 28–40px, max-width 700px
  - Attribution: "— HŌN" — gold, 16px
- **Animation:** Quote reveals line-by-line or word-by-word with staggered timing. Slow, cinematic.

### Scene 6: The Collection (REVENUE SCENE)
- **ID:** `#collection`
- **Background:** var(--color-sand) or subtle gradient
- **Content:**
  - Eyebrow: "THE COLLECTION" — gold, letter-spaced
  - Headline: **"Training Gear for Those Who Bear His Image"** — dark, 32–44px
  - **Two product cards** side-by-side (desktop), stacked (mobile). Each card:
    - Large product image area (placeholder — 400x500px gray box with "Product Image" text)
    - Product title: "Chi-Rho Heavyweight Hoodie" / "Staurogram Training Hoodie"
    - One-line description
    - Price: "$68"
    - **Shopify Buy Button placeholder:**
      ```html
      <div id="shopify-product-1" class="shopify-buy-button-placeholder">
        <!-- ARTHUR: Paste Shopify Buy Button embed code here -->
        <button class="placeholder-btn">Add to Cart</button>
      </div>
      ```
  - Below cards: *"Every order ships with a devotional card and historical context for the symbol on your piece."*
- **Animation:** Header fades in, product cards scale from 0.95→1.0 with opacity fade, staggered.

> **IMPORTANT FOR SHOPIFY INTEGRATION:** The placeholder `<div>` containers (`#shopify-product-1`, `#shopify-product-2`) are where Arthur will paste Shopify Buy Button embed codes. Style these containers with appropriate width/height. The Shopify embed will inject its own product card with image, title, price, and button. Arthur may choose to use custom HTML for the product display and only embed the Shopify "Add to Cart" button component.

### Scene 7: The Journal
- **ID:** `#journal`
- **Background:** var(--color-dark)
- **Height:** 50–70vh (content-driven, doesn't need full viewport)
- **Content:**
  - Eyebrow: "THE JOURNAL" — gold
  - Headline: **"Go Deeper"** — white, 28–36px
  - Three blog post cards in a row (desktop), stacked (mobile):
    - Card: Sand/light bg, post title, excerpt (2 lines), "5 min read", arrow link
    - Post 1: "What Does HŌN Mean?" — `/blog/what-does-hon-mean.html`
    - Post 2: "The Chi-Rho: The Oldest Christian Monogram" — `/blog/chi-rho-monogram.html`
    - Post 3: "Why Your Gym Time Is Already Devotional Time" — `/blog/gym-devotional-time.html`
- **Animation:** Standard fade-up from 20px.

### Scene 8: Email Capture
- **ID:** `#subscribe`
- **Background:** var(--color-dark)
- **Height:** 40–60vh
- **Content (centered):**
  - Headline: **"Join the Community"** — white, 32–40px
  - Subtext: "Historical deep dives. Training wisdom. Honest devotional writing. Delivered to your inbox." — slate/light, 18px
  - Email input field + "I'm In" button (gold bg, dark text)
  - Disclaimer: "No spam. Unsubscribe anytime." — small, subtle
  - **Placeholder form** — just HTML input + button. Arthur will replace with ConvertKit or Mailchimp embed later.
- **Animation:** Fade up.

### Scene 9: Footer
- **ID:** `#footer`
- **Background:** var(--color-dark), slightly darker than other dark sections
- **Content:** Three columns:
  - **Shop:** All Products, Hoodies, Training Shirts, Gift Cards (placeholder links)
  - **Learn:** Journal (/blog/), FAQ (/faq/), Size Guide (#)
  - **Connect:** Instagram (#), Facebook (#), Email Us (mailto:hello@honapparel.com)
- **Bottom:**
  - Tagline: "ὁ ὤν — The One Who Is" — gold, Uncial Antiqua
  - Copyright: "© 2026 HŌN. Athletic Apparel for the Inner Person. Salinas, California."
  - Legal links: Privacy Policy | Terms of Service (placeholder hrefs)

---

## BLOG TEMPLATE

Each blog post is a standalone HTML file at `/blog/[slug].html` sharing the same nav and footer as the homepage.

### Layout
- Max-width: 680px centered
- Line-height: 1.7–1.8
- Body font: Georgia, 18–20px
- Background: var(--color-sand) or white

### Structure (top to bottom)
1. **Breadcrumb:** Home > Journal > [Post Title] — small, slate
2. **Hero block:** Post title (large serif, 32–44px), publish date, estimated read time
3. **Body content:** Standard article — paragraphs, subheadings (h2, h3), block quotes, images
4. **Product CTA:** A styled callout linking to `/#collection` — "See this symbol on our gear →"
5. **Email capture:** Same form component as Scene 8
6. **Related posts:** 2–3 other post cards (same style as Scene 7 cards)

### SEO per post
- `<title>` tag: "[Post Title] | HŌN Journal"
- `<meta name="description">` — unique per post
- Open Graph: og:title, og:description, og:image, og:url
- Schema.org Article markup (JSON-LD in `<head>`)

### Blog Index (`/blog/index.html`)
- Grid of all post cards: title, excerpt, date, read time
- Same nav/footer as homepage

### First 3 Posts (Write Content)

**Post 1: "What Does HŌN Mean?"**
- Explain ὁ ὤν (ho ōn) from Exodus 3:14 in the Septuagint
- God's self-revelation to Moses: "I AM WHO I AM"
- Why this pre-denominational name was chosen for the brand
- Connection to identity and the gym — you train to become who you already are in Christ
- ~800–1000 words, 5 min read

**Post 2: "The Chi-Rho: The Oldest Christian Monogram"**
- History of the Chi-Rho (☧) — 2nd–4th century origins
- Constantine and the "In hoc signo vinces" story
- Greek phrase: ἐν τούτῳ νίκα (en toutō nika) — "In this, conquer"
- How we use it on our gear — the mirror-reverse concept explained
- Romans 8:37 connection — "more than conquerors"
- ~1000–1200 words, 6 min read

**Post 3: "Why Your Gym Time Is Already Devotional Time"**
- The gym as a place of discipline, suffering, and transformation
- 1 Corinthians 9:24-27 — Paul's athletic metaphor
- How physical training mirrors spiritual formation
- Practical ideas for integrating faith into training
- ~700–900 words, 4 min read

---

## FAQ PAGE

Lives at `/faq/index.html`. Shares nav/footer with homepage.

### Accordion Implementation
- Simple HTML/CSS/JS accordion — click question to expand/collapse answer
- Only one answer open at a time (collapse others when one opens)
- Smooth height transition on open/close
- Plus/minus or chevron icon for open/close state

### Questions & Answers

**Q: What does HŌN mean?**
A: HŌN comes from the Greek text ὁ ὤν (ho ōn), which appears in the Septuagint translation of Exodus 3:14 — God's self-revelation to Moses at the burning bush: "I AM WHO I AM." It's the oldest surviving declaration of divine identity in the Judeo-Christian tradition, predating denominational divisions.

**Q: What comes with my order?**
A: Every piece ships with a devotional card specific to the symbol on your garment. The card includes the symbol's history, the original Greek and Latin phrases, a scripture reference, and a short reflection for your training.

**Q: What sizes are available?**
A: We currently offer S, M, L, XL, and XXL. See our Size Guide for detailed measurements. Our hoodies use a relaxed, athletic fit designed for training.

**Q: What's the return policy?**
A: We accept returns within 30 days of delivery for unworn, unwashed items in original condition. Contact hello@honapparel.com to initiate a return.

**Q: Where do you ship?**
A: We ship throughout the United States. International shipping is coming soon.

**Q: How long does shipping take?**
A: Each piece is made to order. Please allow 5–7 business days for production plus 3–5 business days for shipping. You'll receive tracking information by email.

**Q: What printing method do you use?**
A: We use DTFlex (Direct-to-Film Flex) printing on heavyweight garments. This method produces vibrant, durable prints that hold up through heavy use and repeated washing.

**Q: Are these just Christian T-shirts?**
A: No. We recover symbols and phrases from the earliest centuries of the Christian faith — pre-schism, pre-denominational — and present them with historical context. Every piece is designed for people who actually train, with premium fabrics and considered construction. The educational component (devotional cards, blog content) is what separates HŌN from slogan-based faith apparel.

### Schema Markup
Add FAQPage JSON-LD schema in the `<head>` so Google can display rich results:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does HŌN mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "HŌN comes from the Greek text ὁ ὤν (ho ōn)..."
      }
    }
  ]
}
```

---

## SCROLL ANIMATION SPEC

All animations use CSS transitions triggered by adding a `.visible` class via Intersection Observer.

### CSS Pattern
```css
/* Base state — hidden */
.fade-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--transition-base), transform var(--transition-base);
}

/* Visible state — triggered by JS */
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
.stagger > *:nth-child(1) { transition-delay: 0s; }
.stagger > *:nth-child(2) { transition-delay: 0.15s; }
.stagger > *:nth-child(3) { transition-delay: 0.3s; }
.stagger > *:nth-child(4) { transition-delay: 0.45s; }
.stagger > *:nth-child(5) { transition-delay: 0.6s; }
```

### JS Pattern
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // animate once, don't reverse
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up, .fade-in, .scale-in').forEach(el => {
  observer.observe(el);
});
```

### Per-Scene Animation Notes
- **Scene 1 (Hero):** Stagger on page load (use setTimeout, not scroll trigger — it's the first thing visible)
- **Scene 2 (Name):** Greek text → pronunciation → "I AM" → body. Sequential, 0.3s gaps.
- **Scene 3 (Difference):** Eyebrow+headline first, then columns stagger L→R, 0.2s gaps.
- **Scene 4 (Pillars):** Headline first, then each pillar sequential, 0.15s gaps.
- **Scene 5 (Mission):** Quote line-by-line. Wrap each sentence in a span, stagger reveals.
- **Scene 6 (Collection):** Header fades, product cards use `.scale-in` (0.95→1.0 with fade).
- **Scene 7–9:** Standard `.fade-up`.

---

## SEO REQUIREMENTS

- Generate `/sitemap.xml` listing: homepage, all blog posts, FAQ page
- Create `/robots.txt`: `User-agent: * Allow: / Sitemap: https://honapparel.com/sitemap.xml`
- Every page must have: `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`
- Blog posts: schema.org Article JSON-LD
- FAQ: schema.org FAQPage JSON-LD
- All images: meaningful `alt` text
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Homepage title: "HŌN | Athletic Apparel for the Inner Person"
- Homepage description: "Gymwear rooted in the earliest traditions of the Christian faith. Premium athletic apparel with symbols and phrases from the first centuries of Christianity."

---

## GA4 PLACEHOLDER

Place this in the `<head>` of every page. Arthur will replace `G-XXXXXXXXXX` with the real measurement ID.

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## SHOPIFY BUY BUTTON PLACEHOLDERS

In Scene 6 (The Collection), create two placeholder containers:

```html
<div class="product-grid">
  <div class="product-card">
    <div class="product-image-placeholder">
      <!-- Product image will come from Shopify embed or manual HTML -->
      <div style="width:100%;aspect-ratio:4/5;background:#D4C5A9;display:flex;align-items:center;justify-content:center;border-radius:8px;">
        <span style="color:#4A5568;font-style:italic;">Product Image</span>
      </div>
    </div>
    <h3>Chi-Rho Heavyweight Hoodie</h3>
    <p class="product-price">$68</p>
    <div id="shopify-product-1">
      <!-- ARTHUR: Paste Shopify Buy Button embed code here -->
      <button class="btn-gold" disabled>Add to Cart — Coming Soon</button>
    </div>
  </div>

  <div class="product-card">
    <div class="product-image-placeholder">
      <div style="width:100%;aspect-ratio:4/5;background:#D4C5A9;display:flex;align-items:center;justify-content:center;border-radius:8px;">
        <span style="color:#4A5568;font-style:italic;">Product Image</span>
      </div>
    </div>
    <h3>Staurogram Training Hoodie</h3>
    <p class="product-price">$68</p>
    <div id="shopify-product-2">
      <!-- ARTHUR: Paste Shopify Buy Button embed code here -->
      <button class="btn-gold" disabled>Add to Cart — Coming Soon</button>
    </div>
  </div>
</div>
```

Style `.product-card` to be visually complete even without the Shopify embed — so the site looks finished during development.

---

## EMAIL CAPTURE PLACEHOLDER

```html
<form class="email-capture" action="#" method="POST">
  <!-- ARTHUR: Replace this entire form with ConvertKit or Mailchimp embed -->
  <input type="email" placeholder="Your email" required>
  <button type="submit" class="btn-gold">I'm In</button>
  <p class="form-disclaimer">No spam. Unsubscribe anytime.</p>
</form>
```

---

## RESPONSIVE BREAKPOINTS

```css
/* Mobile first — base styles are mobile */
/* Tablet */
@media (min-width: 768px) { }
/* Desktop */
@media (min-width: 1024px) { }
/* Wide */
@media (min-width: 1440px) { }
```

Key responsive changes:
- Scene 3 columns: stacked on mobile, 3-col on desktop
- Scene 6 product cards: stacked on mobile, 2-col on desktop
- Scene 7 blog cards: stacked on mobile, 3-col on desktop
- Nav: hamburger on mobile, inline links on desktop
- Font sizes scale down ~20% on mobile
- Section padding: 40px mobile, 80px desktop

---

## STYLE NOTES

- **No gradients** unless very subtle (dark→slightly-darker)
- **No stock photography** — use solid color blocks and typography until Arthur adds real images
- **Typography is the design** — large, confident serif type does the heavy lifting
- **Generous whitespace** — let content breathe. Padding: 80–120px between content blocks on desktop
- **Gold (#C49B2A) is the accent** — used for eyebrows, CTAs, links, highlights. Never for large background areas.
- **Dark (#0F1B2D) is the primary** — hero, alternating sections, nav, footer
- **Sand (#F5F0E8) is the secondary** — alternating sections, blog bg, cards
- **Links:** gold on dark bg, dark on sand bg. Underline on hover.
- **Buttons:** gold bg, dark text, slight rounded corners (4–6px), serif font, letter-spacing 1px

---

## BUILD PRIORITY

1. **index.html** — Full 9-scene scroll with all animations
2. **css/style.css** — Complete stylesheet
3. **js/main.js** — Scroll animations, nav spy, mobile menu
4. **Blog template** — `/blog/what-does-hon-mean.html` as the template, then clone for other 2 posts
5. **Blog index** — `/blog/index.html`
6. **FAQ** — `/faq/index.html` with accordion + JSON-LD
7. **Supporting files** — sitemap.xml, robots.txt, CNAME, js/shopify-buy.js placeholder

---

## WHAT NOT TO BUILD

- Do NOT set up a Shopify theme or storefront
- Do NOT implement actual payment processing
- Do NOT create a database or backend
- Do NOT use React, Vue, Next.js, or any framework
- Do NOT use Tailwind — write custom CSS
- Do NOT use animation libraries (GSAP, AOS, etc.) — vanilla Intersection Observer + CSS transitions only
- Do NOT hardcode the GA4 measurement ID — use placeholder G-XXXXXXXXXX

---

*End of handoff. Build with excellence. ὁ ὤν — The One Who Is.*
