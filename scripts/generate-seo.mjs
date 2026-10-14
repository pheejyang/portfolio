// Writes public/robots.txt and public/sitemap.xml from VITE_SITE_URL.
// Run with: npm run seo   (also runs automatically before dev and build)
//
// The site URL is read from the VITE_SITE_URL environment variable first (handy on Netlify / Vercel /
// GitHub Actions), then from .env.production, then from .env.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

// Paths crawlers should not fetch. cv.pdf contains personal phone numbers: remove that line to let search engines index it.
const DISALLOW = ['/cv.pdf']

function readEnvFile(name) {
  const file = join(root, name)
  if (!existsSync(file)) return undefined
  const line = readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .find((l) => /^\s*VITE_SITE_URL\s*=/.test(l))
  return line?.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '')
}

const raw = process.env.VITE_SITE_URL || readEnvFile('.env.production') || readEnvFile('.env') || ''
const siteUrl = raw.replace(/\/+$/, '')

if (!/^https?:\/\/[^\s/]+/i.test(siteUrl) || siteUrl.includes('your-domain')) {
  console.warn(
    `seo: WARNING - VITE_SITE_URL is "${raw || '(not set)'}". Set your real address in .env (for example https://pheng.example.com) before publishing.`,
  )
}

const robots = [
  'User-agent: *',
  'Allow: /',
  ...DISALLOW.map((p) => `Disallow: ${p}`),
  '',
  `Sitemap: ${siteUrl}/sitemap.xml`,
  '',
].join('\n')

// One-page app: sections use #hash links, which search engines treat as the same page, so only "/" is listed.
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`

mkdirSync(publicDir, { recursive: true })
writeFileSync(join(publicDir, 'robots.txt'), robots)
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)
console.log(`seo: robots.txt + sitemap.xml written for ${siteUrl || '(no site url)'}`)
