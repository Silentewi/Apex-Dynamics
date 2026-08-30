import sharp from 'sharp'
import path from 'path'

const porschePath = 'C:/Users/Lena-/.gemini/antigravity-ide/brain/cd8ceaf7-b85c-4527-bf77-6c8ccbd56ab0/.user_uploaded/media_1788098630456.jpg'

// Smoothstep helper
function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

async function enhancePorsche() {
  const metadata = await sharp(porschePath).metadata()
  console.log(`Original Porsche image: ${metadata.width}x${metadata.height}`)

  const targetWidth = 2560
  const targetHeight = Math.round((metadata.height / metadata.width) * targetWidth)

  // First pass: resize with lanczos3, slight median/denoise for posterized darks, unsharp mask for metallic contours and headlights
  const resized = await sharp(porschePath)
    .resize({
      width: targetWidth,
      height: targetHeight,
      kernel: sharp.kernel.lanczos3,
      fit: 'cover',
    })
    .median(1)
    .sharpen({
      sigma: 1.1,
      m1: 1.3,
      m2: 2.0,
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

  const { data, info } = resized
  const W = info.width
  const H = info.height

  const padLeft = Math.round(W * 0.08)
  const padRight = Math.round(W * 0.08)
  const padTop = Math.round(H * 0.08)
  const padBottom = Math.round(H * 0.12)

  const outBuffer = Buffer.alloc(W * H * 4)

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

      let r = data[srcIdx]
      let g = data[srcIdx + 1]
      let b = data[srcIdx + 2]

      // Clean up low level JPEG compression noise in very dark areas
      if (r < 10 && g < 10 && b < 10) {
        r = 0
        g = 0
        b = 0
      }

      outBuffer[dstIdx] = Math.round(r * factor)
      outBuffer[dstIdx + 1] = Math.round(g * factor)
      outBuffer[dstIdx + 2] = Math.round(b * factor)
      outBuffer[dstIdx + 3] = 255
    }
  }

  await sharp(outBuffer, {
    raw: {
      width: W,
      height: H,
      channels: 4,
    },
  })
    .webp({ quality: 96, lossless: false, effort: 6 })
    .toFile(path.join('public', 'porsche-front.webp'))

  await sharp(outBuffer, {
    raw: {
      width: W,
      height: H,
      channels: 4,
    },
  })
    .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
    .toFile(path.join('public', 'porsche-front.jpg'))

  console.log(`Saved enhanced Porsche image: ${W}x${H}`)
}

enhancePorsche().catch(console.error)
