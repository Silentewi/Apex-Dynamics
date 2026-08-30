import sharp from 'sharp'
import path from 'path'

const newPorschePath = 'C:/Users/Lena-/.gemini/antigravity-ide/brain/cd8ceaf7-b85c-4527-bf77-6c8ccbd56ab0/.user_uploaded/media_1788099904249.jpg'

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

async function processNewPorsche() {
  const meta = await sharp(newPorschePath).metadata()
  console.log(`Original new Porsche: ${meta.width}x${meta.height}`)

  const canvasW = 3000
  const canvasH = 1800

  // 1. High precision upscale
  const upscaledCar = await sharp(newPorschePath)
    .resize({
      width: 1800,
      height: 3200,
      kernel: sharp.kernel.lanczos3,
      fit: 'cover',
    })
    .sharpen({
      sigma: 1.3,
      m1: 1.6,
      m2: 2.6,
      x1: 2.0,
      y2: 12.0,
      y3: 24.0,
    })
    .modulate({
      brightness: 1.02,
      saturation: 1.08,
    })
    .extract({
      left: 0,
      top: 850,
      width: 1800,
      height: 1950,
    })
    .toBuffer()

  // Fit nicely inside canvas: height 1600, width proportional
  const carHeight = 1620
  const carWidth = Math.round(1800 * (carHeight / 1950)) // ~1495

  const resizedCarBuffer = await sharp(upscaledCar)
    .resize(carWidth, carHeight)
    .toBuffer()

  const posX = Math.round((canvasW - carWidth) / 2)
  const posY = Math.round((canvasH - carHeight) / 2) + 20

  // 3. Composite onto deep black studio canvas
  const compositedBuffer = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite([
      {
        input: resizedCarBuffer,
        left: posX,
        top: posY,
      },
    ])
    .raw()
    .toBuffer({ resolveWithObject: true })

  const W = compositedBuffer.info.width
  const H = compositedBuffer.info.height
  const rawData = compositedBuffer.data

  // 4. Smooth feathering on all 4 borders
  const padLeft = Math.round(W * 0.14)
  const padRight = Math.round(W * 0.14)
  const padTop = Math.round(H * 0.14)
  const padBottom = Math.round(H * 0.18)

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

      let r = rawData[idx]
      let g = rawData[idx + 1]
      let b = rawData[idx + 2]

      if (r < 18 && g < 18 && b < 18) {
        r = Math.round(r * 0.3)
        g = Math.round(g * 0.3)
        b = Math.round(b * 0.3)
      }

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

  console.log(`Successfully generated new glowing Porsche GT3 3000x${H} slices`)
}

processNewPorsche().catch(console.error)
