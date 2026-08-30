import sharp from 'sharp'
import path from 'path'

const inputPath = 'C:/Users/Lena-/.gemini/antigravity-ide/brain/cd8ceaf7-b85c-4527-bf77-6c8ccbd56ab0/.user_uploaded/media_1788098992020.jpg'

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

async function processPorsche() {
  const meta = await sharp(inputPath).metadata()
  const W_orig = meta.width
  const H_orig = meta.height

  // Get raw original pixels
  const { data: rawData } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true })

  // Clean pixelated quantization noise in dark regions (windshield, roof, black hood center)
  // Cleaned buffer
  const cleanedData = Buffer.from(rawData)

  for (let y = 0; y < H_orig; y++) {
    for (let x = 0; x < W_orig; x++) {
      const idx = (y * W_orig + x) * 3
      const r = cleanedData[idx]
      const g = cleanedData[idx + 1]
      const b = cleanedData[idx + 2]

      // Identify pixelated compression noise in the upper central windshield and black hood scoop area
      // where pixels erroneously have light bluish-grey noise (b > r + 15, or isolated noisy grey patches)
      const isUpperCentral = (y > 40 && y < 210 && x > 280 && x < 750)
      const isHoodNoise = (y >= 210 && y < 320 && x > 330 && x < 690)

      // Emblem location: x ~ 500-525, y ~ 290-315. Preserve emblem colors (gold/red/black)!
      const isEmblem = (x > 495 && x < 530 && y > 290 && y < 320)

      if (!isEmblem) {
        // Windshield / roof blue-grey pixelated compression patches
        if (isUpperCentral) {
          // If it's the cyan/grey noise patches on black roof/glass
          if ((b > r + 15 && b > 60 && r < 140) || (g > 80 && b > 80 && r < 100 && y < 140)) {
            // Blend into dark tinted glass / carbon
            cleanedData[idx] = Math.round(r * 0.15)
            cleanedData[idx + 1] = Math.round(g * 0.15)
            cleanedData[idx + 2] = Math.round(b * 0.18)
          }
        }

        // Hood black scoop / decal pixelated noise
        if (isHoodNoise) {
          // The grey speckled noise on the black hood decal
          if (r > 40 && r < 130 && g > 40 && g < 130 && b > 40 && b < 140 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
            // Keep subtle gradient if it's the center stripe, but darken the speckled noise
            // Stripe is at x ~ 430-470 and 550-590 (y < 250)
            const isStripe = (y < 250 && ((x > 430 && x < 475) || (x > 550 && x < 595)))
            if (!isStripe && y > 240) {
              cleanedData[idx] = Math.round(r * 0.2)
              cleanedData[idx + 1] = Math.round(g * 0.2)
              cleanedData[idx + 2] = Math.round(b * 0.2)
            }
          }
        }
      }
    }
  }

  // Target high resolution: 3000 x 1688
  const targetW = 3000
  const targetH = Math.round((H_orig / W_orig) * targetW)

  // Upscale cleaned data with Lanczos3, gentle median to remove any remaining jagged pixel edges, then unsharp mask
  const upscaled = await sharp(cleanedData, {
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
      m1: 1.4,
      m2: 2.2,
      x1: 2.0,
      y2: 10.0,
      y3: 20.0,
    })
    .modulate({
      brightness: 1.02,
      saturation: 1.06,
    })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const W = upscaled.info.width
  const H = upscaled.info.height
  const uData = upscaled.data

  // Feather all 4 borders to pure black 0,0,0 so there are ZERO border lines
  const padLeft = Math.round(W * 0.08)
  const padRight = Math.round(W * 0.08)
  const padTop = Math.round(H * 0.08)
  const padBottom = Math.round(H * 0.12)

  const finalBuffer = Buffer.alloc(W * H * 3)

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
      const idx = (y * W + x) * 3

      const r = uData[idx]
      const g = uData[idx + 1]
      const b = uData[idx + 2]

      finalBuffer[idx] = Math.round(r * factor)
      finalBuffer[idx + 1] = Math.round(g * factor)
      finalBuffer[idx + 2] = Math.round(b * factor)
    }
  }

  // Save master image
  await sharp(finalBuffer, {
    raw: { width: W, height: H, channels: 3 },
  })
    .webp({ quality: 98, lossless: false, effort: 6 })
    .toFile(path.join('public', 'porsche-front.webp'))

  await sharp(finalBuffer, {
    raw: { width: W, height: H, channels: 3 },
  })
    .jpeg({ quality: 98, chromaSubsampling: '4:4:4' })
    .toFile(path.join('public', 'porsche-front.jpg'))

  // Slice into 3 seamless vertical panels
  const sliceW = Math.floor(W / 3)

  for (let i = 0; i < 3; i++) {
    const left = i * sliceW
    const currentSliceW = (i === 2) ? (W - left) : sliceW

    await sharp(finalBuffer, {
      raw: { width: W, height: H, channels: 3 },
    })
      .extract({ left, top: 0, width: currentSliceW, height: H })
      .webp({ quality: 98, lossless: false, effort: 6 })
      .toFile(path.join('public', `porsche-part-${i + 1}.webp`))

    console.log(`Generated slice ${i + 1}: ${currentSliceW}x${H}`)
  }

  console.log(`Successfully generated clean 3000x${H} Porsche image and 3 slices`)
}

processPorsche().catch(console.error)
