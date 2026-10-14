// Scans public/gallery and writes data/gallery.json.
// Existing alt text / captions are kept for files whose names have not changed.
// Run with: npm run gallery   (also runs automatically before dev and build)
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'public', 'gallery')
const out = join(root, 'data', 'gallery.json')
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

// Read width/height straight from the file header (no dependencies). Returns null if unknown.
function size(buf, ext) {
  try {
    if (ext === '.png') return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    if (ext === '.jpg' || ext === '.jpeg') {
      let i = 2
      while (i < buf.length) {
        if (buf[i] !== 0xff) { i++; continue }
        const m = buf[i + 1]
        if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m))
          return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) }
        i += 2 + buf.readUInt16BE(i + 2)
      }
    }
    if (ext === '.webp') {
      const kind = buf.toString('ascii', 12, 16)
      if (kind === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff }
      if (kind === 'VP8L') {
        const b = buf.readUInt32LE(21)
        return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 }
      }
      if (kind === 'VP8X') return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 }
    }
  } catch {
    /* fall through */
  }
  return null // AVIF and unreadable files: the page measures them after load
}

mkdirSync(dir, { recursive: true })

let previous = []
try {
  previous = JSON.parse(readFileSync(out, 'utf8'))
  if (!Array.isArray(previous)) previous = []
} catch {
  previous = []
}
const known = new Map(previous.map((p) => [p.file, p]))

const files = readdirSync(dir, { withFileTypes: true })
  .filter((f) => f.isFile() && !f.name.startsWith('.') && EXT.has(extname(f.name).toLowerCase()))
  .map((f) => f.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

const items = files.map((file) => {
  const old = known.get(file) ?? {}
  const ext = extname(file).toLowerCase()
  const dims = size(readFileSync(join(dir, file)), ext)
  return {
    file,
    src: `gallery/${encodeURIComponent(file)}`,
    alt: old.alt ?? '',
    caption: old.caption ?? '',
    ...(dims ?? {}),
  }
})

if (!existsSync(dirname(out))) mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(items, null, 2) + '\n')
console.log(`gallery: ${items.length} image${items.length === 1 ? '' : 's'} -> data/gallery.json`)
