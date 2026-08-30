import sharp from 'sharp'
import path from 'path'

const logoPath = 'C:/Users/Lena-/.gemini/antigravity-ide/brain/cd8ceaf7-b85c-4527-bf77-6c8ccbd56ab0/.user_uploaded/media_1788096878272.jpg'

async function processLogo() {
  // Center crop around the logo
  // Logo is roughly in the center: x around 410 to 610, y around 200 to 390
  const original = await sharp(logoPath).raw().toBuffer({ resolveWithObject: true })
  const { data, info } = original
  const W = info.width
  const H = info.height

  // Let's find the bounding box of non-black pixels (threshold > 25)
  let minX = W, maxX = 0, minY = H, maxY = 0

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 3
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      const brightness = (r + g + b) / 3

      // Skip the isolated single stray dot on the right if x > 610
      if (x > 610 && brightness > 30) continue

      if (brightness > 20) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  console.log(`Logo bounds: x:[${minX}, ${maxX}], y:[${minY}, ${maxY}]`)

  // Add small padding
  const pad = 10
  const cropX = Math.max(0, minX - pad)
  const cropY = Math.max(0, minY - pad)
  const cropW = Math.min(W - cropX, (maxX - minX) + pad * 2)
  const cropH = Math.min(H - cropY, (maxY - minY) + pad * 2)

  // Extract cropped region and make black background transparent
  const croppedRaw = await sharp(logoPath)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const cW = croppedRaw.info.width
  const cH = croppedRaw.info.height
  const cData = croppedRaw.data
  const rgbaBuffer = Buffer.alloc(cW * cH * 4)

  for (let y = 0; y < cH; y++) {
    for (let x = 0; x < cW; x++) {
      const srcIdx = (y * cW + x) * 3
      const dstIdx = (y * cW + x) * 4

      const r = cData[srcIdx]
      const g = cData[srcIdx + 1]
      const b = cData[srcIdx + 2]
      const maxVal = Math.max(r, g, b)

      // Calculate smooth alpha from luminance
      let alpha = 0
      if (maxVal > 15) {
        alpha = Math.min(255, Math.round((maxVal / 255) * 1.3 * 255))
      }

      rgbaBuffer[dstIdx] = r
      rgbaBuffer[dstIdx + 1] = g
      rgbaBuffer[dstIdx + 2] = b
      rgbaBuffer[dstIdx + 3] = alpha
    }
  }

  // Save high-resolution PNG with transparency
  await sharp(rgbaBuffer, {
    raw: {
      width: cW,
      height: cH,
      channels: 4,
    },
  })
    .resize({ width: 256, height: 256, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .sharpen()
    .png()
    .toFile(path.join('public', 'logo.png'))

  await sharp(rgbaBuffer, {
    raw: {
      width: cW,
      height: cH,
      channels: 4,
    },
  })
    .resize({ width: 256, height: 256, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 100, lossless: true })
    .toFile(path.join('public', 'logo.webp'))

  console.log('Successfully created public/logo.png & public/logo.webp')
}

processLogo().catch(console.error)
