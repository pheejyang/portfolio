# Pheng Yang — Portfolio

Static single-page portfolio: React + TypeScript + Vite + Tailwind CSS v4. No backend, no API calls.

```bash
npm install
npm run dev      # development (regenerates the gallery list first)
npm run build    # type-check + production build into dist/
npm run preview  # serve dist/ locally
```

## Where to put your files

| File | Purpose |
| --- | --- |
| `public/cv.pdf` | The "Download CV" button. If it is missing, the button shows a hint instead of a broken download. |
| `public/hero.jpg` | Hero photo (3:4 portrait works best). **The current one is the small photo taken from your CV — replace it with a larger one.** |
| `public/projects/` | Project screenshots (the current ones are marked placeholders). |
| `public/gallery/` | Gallery photos (JPG, JPEG, PNG, WebP, AVIF). |

## Editing content (`data/*.json`)

All portfolio content lives in `data/`. Text that should differ per language is written as `{ "la": "…", "en": "…" }`; a plain string is used for both languages. A missing language falls back to Lao.

- `hero.json` – name, rotating typing titles, profile text
- `skill.json` – `{ name, level }` (level 0–100)
- `project.json` – `id, name, description, technologies, images, githubUrl, liveUrl` (links are shown only when filled; `likes` is accepted but never displayed; set `placeholderImages` to `false` once you add real screenshots)
- `experience.json`, `education.json`, `certificate.json` – timeline / card entries (an empty array shows a friendly empty state)
- `contact.json` – `mobile, email, facebook, tiktok, youtube, portfolio` (empty fields are hidden)
- `gallery.json` – generated, see below

Interface text (menu, buttons, headings…) is in `src/locale/la.json` and `src/locale/en.json`.

## Gallery

Drop images into `public/gallery/` and run `npm run gallery` (this also runs automatically before `npm run dev` and `npm run build`). The script rewrites `data/gallery.json`, reads each image's width/height to avoid layout shift, skips hidden and unsupported files, and keeps any `alt` / `caption` you added by hand as long as the file name stays the same.

Tip: resize photos to roughly 2000 px on the long side before uploading; thumbnails are lazy-loaded but not resized.

## How scrolling stays stable

- All eight sections stay mounted; nothing is hidden or unmounted based on visibility.
- The active menu item is the section under a thin band in the middle of the screen, and the current one stays active until it leaves that band (no flip-flopping on a boundary).
- Entrance animations only use opacity/transform and are added once per section (`.in` is never removed), so they never restart.
- `prefers-reduced-motion` turns animations and smooth scrolling off.
- Scroll snapping is `mandatory` on large desktop screens with a mouse and `proximity` elsewhere.

## Accent colour and theme

Colours are CSS variables at the top of `src/index.css` (`--accent` etc.), one set for light and one for dark. The theme and language are saved in `localStorage`; with no saved theme the system preference is used.

## SEO, share image and robots.txt

1. Put your real address in `.env`: `VITE_SITE_URL=https://your-domain.com` (no trailing slash). It feeds the canonical link, the share-image URLs, `robots.txt` and `sitemap.xml`. On Netlify/Vercel you can set the same variable in the dashboard instead.
2. `npm run seo` (also runs before `dev` and `build`) writes `public/robots.txt` and `public/sitemap.xml`. Edit the `DISALLOW` list at the top of `scripts/generate-seo.mjs` to change what crawlers may fetch (by default `/cv.pdf` is blocked because it contains phone numbers).
3. Run `npm run build` and upload `dist/`. After deploying, open `https://your-domain.com/robots.txt` and `/sitemap.xml` to confirm they load.
4. Add the site in Google Search Console and submit `https://your-domain.com/sitemap.xml`.
5. Test the share preview with the Facebook Sharing Debugger and the LinkedIn Post Inspector. These tools cache images, so re-scrape after you change `public/og-image.png`.

The share image is `public/og-image.png` (1200 × 630). Replace it with your own design any time, keeping the same size and file name.
