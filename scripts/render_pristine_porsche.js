import sharp from 'sharp'
import path from 'path'

const porscheOriginal = 'C:/Users/Lena-/.gemini/antigravity-ide/brain/cd8ceaf7-b85c-4527-bf77-6c8ccbd56ab0/.user_uploaded/media_1788098630456.jpg'

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

async function renderPristinePorsche() {
  const meta = await sharp(porscheOriginal).metadata()
  const W_orig = meta.width
  const H_orig = meta.height

  const { data: rawData } = await sharp(porscheOriginal).raw().toBuffer({ resolveWithObject: true })
  const cleaned = Buffer.from(rawData)

  // Clean pixelated quantization noise in dark zones (hood, windshield, roof)
  for (let y = 0; y < H_orig; y++) {
    for (let x = 0; x < W_orig; x++) {
      const idx = (y * W_orig + x) * 3
      const r = cleaned[idx]
      const g = cleaned[idx + 1]
      const b = cleaned[idx + 2]

      // Protect Porsche golden crest (x: 495-530, y: 290-320)
      const isCrest = (x >= 495 && x <= 530 && y >= 290 && y <= 320)
      if (isCrest) continue

      // Clean cyan/blue-grey JPEG blocks on roof and glass
      if (y < 210 && x > 260 && x < 765) {
        if ((b > r + 12 && b > 50 && r < 140) || (g > 75 && b > 75 && r < 100 && y < 150)) {
          cleaned[idx] = Math.round(r * 0.12)
          cleaned[idx + 1] = Math.round(g * 0.12)
          cleaned[idx + 2] = Math.round(b * 0.15)
        }
      }

      // Clean speckle noise on hood black scoop (y: 220-330)
      if (y >= 210 && y <= 330 && x > 330 && x < 695) {
        // Avoid the silver racing stripes (x: 430-475 and 550-595, y < 250)
        const isStripe = (y < 250 && ((x > 430 && x < 475) || (x > 550 && x < 595)))
        if (!isStripe) {
          if (r > 35 && r < 125 && g > 35 && g < 125 && b > 35 && b < 135) {
            cleaned[idx] = Math.round(r * 0.18)
            cleaned[idx + 1] = Math.round(g * 0.18)
            cleaned[idx + 2] = Math.round(b * 0.18)
          }
        }
      }
    }
  }

  // 3600 x 2025 High Precision Upscale
  const targetW = 3600
  const targetH = Math.round((H_orig / W_orig) * targetW)

  const upscaled = await sharp(cleaned, {
    raw: { width: W_orig, height: H_orig, channels: 3 },
  })
    .resize({
      width: targetW,
      height: targetH,
      kernel: sharp.kernel.lanczos3,
      fit: 'cover',
    })
    .sharpen({
      sigma: 1.2,
      m1: 1.5,
      m2: 2.5,
      x1: 2.0,
      y2: 12.0,
      y3: 22.0,
    })
    .modulate({
      brightness: 1.02,
      saturation: 1.08,
    })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const W = upscaled.info.width
  const H = upscaled.info.height
  const uData = upscaled.data

  // Generous feather on all 4 borders so the photo melts into the black page seamlessly
  const padLeft = Math.round(W * 0.14)
  const padRight = Math.round(W * 0.14)
  const padTop = Math.round(H * 0.14)
  const padBottom = Math.round(H * 0.20) // wide floor feather

  const finalBuffer = Buffer.alloc(W * H * 4) // RGBA

  for (let y = 0; y < H; y++) {
    let fy = 1.0
    if (y < padTop) {
      fy = smoothstep(0, padTop, y)
    } else if (y > H - padBottom) {
      fy = smoothstep(H, H - padBottom, y)
    }

    for (let x = 0; x < W; x++) {
      let fx = 1.0
      if (x < padLeft) {
        fx = smoothstep(0, padLeft, x)
      } else if (x > W - padRight) {
        fx = smoothstep(W, W - padRight, x)
      }

      const factor = fx * fy
      const srcIdx = (y * W + x) * 3
      const dstIdx = (y * W + x) * 4

      let r = uData[srcIdx]
      let g = uData[srcIdx + 1]
      let b = uData[srcIdx + 2]

      // Background cleanup: if color is dark floor/wall without lighting, fade deeply
      if (r < 18 && g < 18 && b < 18) {
        r = Math.round(r * 0.5)
        g = Math.round(g * 0.5)
        b = Math.round(b * 0.5)
      }

      finalBuffer[dstIdx] = Math.round(r * factor)
      finalBuffer[dstIdx + 1] = Math.round(g * factor)
      finalBuffer[dstIdx + 2] = Math.round(b * factor)
      finalBuffer[dstIdx + 3] = 255
    }
  }

  // Save master seamless image
  await sharp(finalBuffer, {
    raw: { width: W, height: H, channels: 4 },
  })
    .webp({ quality: 98, lossless: false, effort: 6 })
    .toFile(path.join('public', 'porsche-front.webp'))

  // Generate 3 pixel-perfect slices
  const sliceW = Math.floor(W / 3)

  for (let i = 0; i < 3; i++) {
    const left = i * sliceW
    const currentSliceW = (i === 2) ? (W - left) : sliceW

    await sharp(finalBuffer, {
      raw: { width: W, height: H, channels: 4 },
    })
      .extract({ left, top: 0, width: currentSliceW, height: H })
      .webp({ quality: 98, lossless: false, effort: 6 })
      .toFile(path.join('public', `porsche-part-${i + 1}.webp`))

    console.log(`Exported slice ${i + 1}: ${currentSliceW}x${H}`)
  }

  console.log(`Rendered pristine seamless Porsche: ${W}x${H}`)
}

renderPristinePorsche().catch(console.error)
