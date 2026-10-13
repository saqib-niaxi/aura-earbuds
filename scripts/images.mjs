// Converts the source photos in photos/ into small WebP files for the gallery.
// Usage: npm run images
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'photos'
const OUT = 'public/images'

await mkdir(OUT, { recursive: true })
for (const file of await readdir(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue
  const out = path.join(OUT, file.replace(/\.\w+$/, '.webp'))
  const info = await sharp(path.join(SRC, file))
    .resize({ width: 1000, height: 1200, fit: 'cover', position: 'attention' })
    .webp({ quality: 72 })
    .toFile(out)
  console.log(`${out}  ${Math.round(info.size / 1024)} kB`)
}
