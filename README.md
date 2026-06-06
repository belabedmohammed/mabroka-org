# Mabroka.org

Landing page for [mabroka.org](https://mabroka.org) — Vite, vanilla HTML/CSS/JS, Formspree contact form, Cloudflare Pages–ready.

## Local development

```bash
npm install
cp .env.example .env   # then add your Formspree form ID
npm run dev
```

Open `http://localhost:5173`.

## Contact form (Formspree)

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy the form ID (the part after `/f/` in the endpoint URL)
3. Add it to `.env`:

   ```
   VITE_FORMSPREE_ID=your_form_id_here
   ```

4. Restart the dev server

For production on Cloudflare Pages, add `VITE_FORMSPREE_ID` as an **Environment variable** in the project settings (Production + Preview).

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Testing (Playwright)

```bash
npm install
npx playwright install chromium   # first time only
npm test
```

Tests build the production site, start a preview server, and run E2E checks in desktop and mobile viewports. CI runs automatically on push via GitHub Actions.

Interactive mode: `npm run test:ui`

## Deploy on Cloudflare Pages

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial mabroka.org site"
git push -u origin master
```

### 2. Connect Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select the `mabroka-org` repository
3. Build settings:
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Environment variables:** add `VITE_FORMSPREE_ID` with your Formspree ID
5. Deploy

### 3. Custom domain

1. In the Pages project → **Custom domains** → add `mabroka.org` and `www.mabroka.org`
2. If your domain is on Cloudflare, DNS records are added automatically
3. Wait for SSL provisioning (usually a few minutes)

### 4. Search Console (optional)

After the site is live, add the property at [Google Search Console](https://search.google.com/search-console) and submit `https://mabroka.org/sitemap.xml`.

## Project structure

```
index.html          Main page
styles/main.css     Styles
scripts/main.js     Nav + Formspree form handler
public/             Static assets (favicon, OG image, sitemap, headers)
```

## Customize

- **Copy & sections** — `index.html`
- **Colors & layout** — `styles/main.css`
- **Social preview image** — replace `public/og-image.svg` (1200×630 PNG recommended for widest platform support)
