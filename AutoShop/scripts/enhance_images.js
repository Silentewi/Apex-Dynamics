import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const originalExterior = 'C:/Users/Lena-/.gemini/antigravity-ide/brain/cd8ceaf7-b85c-4527-bf77-6c8ccbd56ab0/.user_uploaded/media_1788095702137.jpg'
const originalInterior = 'C:/Users/Lena-/.gemini/antigravity-ide/brain/cd8ceaf7-b85c-4527-bf77-6c8ccbd56ab0/.user_uploaded/media_1788095703358.jpg'

async function processImage(inputPath, outputName) {
  const metadata = await sharp(inputPath).metadata()
  console.log(`Original ${outputName} size: ${metadata.width}x${metadata.height}`)

  const targetWidth = 2560
  const targetHeight = Math.round((metadata.height / metadata.width) * targetWidth)

  // Upscale with Lanczos3, unsharp mask for crisp mechanical and body reflections,
  // and subtle contrast curve to make blacks truly rich and eliminate JPEG compression artifacts
  await sharp(inputPath)
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
      saturation: 1.05,
    })
    .webp({ quality: 95, lossless: false, effort: 6 })
    .toFile(path.join('public', `${outputName}.webp`))

  // Also save a pristine high-res JPG version as fallback
  await sharp(inputPath)
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
      saturation: 1.05,
    })
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(path.join('public', `${outputName}.jpg`))

  console.log(`Processed ${outputName} successfully to 2560px WebP & JPG`)
}

async function main() {
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public')
  }
  await processImage(originalExterior, 'car-exterior')
  await processImage(originalInterior, 'car-interior')
}

main().catch(console.error)
