import sharp from 'sharp'
import path from 'path'

const originalExterior = 'C:/Users/Lena-/.gemini/antigravity-ide/brain/cd8ceaf7-b85c-4527-bf77-6c8ccbd56ab0/.user_uploaded/media_1788095702137.jpg'
const originalInterior = 'C:/Users/Lena-/.gemini/antigravity-ide/brain/cd8ceaf7-b85c-4527-bf77-6c8ccbd56ab0/.user_uploaded/media_1788095703358.jpg'

// Smoothstep interpolation (3x^2 - 2x^3) for ultra-soft, natural gradient falloff
function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

async function processSeamlessImage(inputPath, outputName) {
  const targetWidth = 2560
  const metadata = await sharp(inputPath).metadata()
  const targetHeight = Math.round((metadata.height / metadata.width) * targetWidth)

  // 1. First upscale and sharpen
  const resized = await sharp(inputPath)
    .resize({
      width: targetWidth,
      height: targetHeight,
      kernel: sharp.kernel.lanczos3,
      fit: 'cover',
    })
    .sharpen({
      sigma: 1.2,
      m1: 1.5,
      m2: 2.0,
      x1: 2.0,
      y2: 10.0,
      y3: 20.0,
    })
    .modulate({
      brightness: 1.02,
      saturation: 1.04,
    })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { data, info } = resized
  const W = info.width
  const H = info.height

  // Padding / feather zones (in pixels)
  // Left and Right: 280px (about 11% of width)
  // Top: 180px (about 12% of height)
  // Bottom: 200px (about 14% of height)
  const padLeft = Math.round(W * 0.12)
  const padRight = Math.round(W * 0.12)
  const padTop = Math.round(H * 0.10)
  const padBottom = Math.round(H * 0.14)

  // Create RGBA buffer where alpha and RGB blend seamlessly to 0 / black at all edges
  const outBuffer = Buffer.alloc(W * H * 4)

  for (let y = 0; y < H; y++) {
    // Vertical feather
    let fy = 1.0
    if (y < padTop) {
      fy = smoothstep(0, padTop, y)
    } else if (y > H - padBottom) {
      fy = smoothstep(H, H - padBottom, y)
    }

    for (let x = 0; x < W; x++) {
      // Horizontal feather
      let fx = 1.0
      if (x < padLeft) {
        fx = smoothstep(0, padLeft, x)
      } else if (x > W - padRight) {
        fx = smoothstep(W, W - padRight, x)
      }

      const factor = fx * fy

      const srcIdx = (y * W + x) * 3
      const dstIdx = (y * W + x) * 4

      const r = data[srcIdx]
      const g = data[srcIdx + 1]
      const b = data[srcIdx + 2]

      // Multiply RGB by factor to fade colors to pitch black at edges
      outBuffer[dstIdx] = Math.round(r * factor)
      outBuffer[dstIdx + 1] = Math.round(g * factor)
      outBuffer[dstIdx + 2] = Math.round(b * factor)
      outBuffer[dstIdx + 3] = 255
    }
  }

  // Save as WebP and JPG
  await sharp(outBuffer, {
    raw: {
      width: W,
      height: H,
      channels: 4,
    },
  })
    .webp({ quality: 96, lossless: false, effort: 6 })
    .toFile(path.join('public', `${outputName}.webp`))

  await sharp(outBuffer, {
    raw: {
      width: W,
      height: H,
      channels: 4,
    },
  })
    .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
    .toFile(path.join('public', `${outputName}.jpg`))

  console.log(`Created seamless edge image ${outputName}: ${W}x${H}`)
}

async function main() {
  await processSeamlessImage(originalExterior, 'car-exterior')
  await processSeamlessImage(originalInterior, 'car-interior')
}

main().catch(console.error)
