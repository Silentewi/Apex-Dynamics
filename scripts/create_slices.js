import sharp from 'sharp'
import path from 'path'

const porschePath = 'C:/Users/Lena-/.gemini/antigravity-ide/brain/cd8ceaf7-b85c-4527-bf77-6c8ccbd56ab0/.user_uploaded/media_1788098630456.jpg'

async function createUltraCrispSlices() {
  const meta = await sharp(porschePath).metadata()
  console.log(`Original Porsche: ${meta.width}x${meta.height}`)

  // Total target width: 3600 x 2025 (ultra sharp 4K resolution)
  const totalW = 3600
  const totalH = Math.round((meta.height / meta.width) * totalW)

  // 1. Process master image with high-pass sharpening and contrast enhancement
  const master = await sharp(porschePath)
    .resize({
      width: totalW,
      height: totalH,
      kernel: sharp.kernel.lanczos3,
      fit: 'cover',
    })
    .sharpen({
      sigma: 1.4,
      m1: 1.8,
      m2: 3.0,
      x1: 2.0,
      y2: 12.0,
      y3: 24.0,
    })
    .modulate({
      brightness: 1.03,
      saturation: 1.08,
    })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const W = master.info.width
  const H = master.info.height
  const sliceW = Math.floor(W / 3)

  console.log(`Master high-res: ${W}x${H}, each slice width: ${sliceW}`)

  // Save the full ultra-sharp image
  await sharp(master.data, {
    raw: { width: W, height: H, channels: 3 },
  })
    .webp({ quality: 98, lossless: false, effort: 6 })
    .toFile(path.join('public', 'porsche-front.webp'))

  await sharp(master.data, {
    raw: { width: W, height: H, channels: 3 },
  })
    .jpeg({ quality: 98, chromaSubsampling: '4:4:4' })
    .toFile(path.join('public', 'porsche-front.jpg'))

  // Also slice into 3 ultra-sharp individual panels for crystal-clear 1:1 pixel rendering
  for (let i = 0; i < 3; i++) {
    const left = i * sliceW
    // For the last slice, take the remaining width to avoid any rounding gaps
    const currentSliceW = (i === 2) ? (W - left) : sliceW

    await sharp(master.data, {
      raw: { width: W, height: H, channels: 3 },
    })
      .extract({ left, top: 0, width: currentSliceW, height: H })
      .sharpen({ sigma: 1.0, m1: 1.2, m2: 2.0 })
      .webp({ quality: 98, lossless: false, effort: 6 })
      .toFile(path.join('public', `porsche-part-${i + 1}.webp`))

    console.log(`Saved slice public/porsche-part-${i + 1}.webp (${currentSliceW}x${H})`)
  }
}

createUltraCrispSlices().catch(console.error)
