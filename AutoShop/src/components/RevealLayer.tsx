import { useEffect, useRef, type FC } from 'react'

interface RevealLayerProps {
  image: string
  cursorX: number
  cursorY: number
  spotlightRadius?: number
}

export const RevealLayer: FC<RevealLayerProps> = ({
  image,
  cursorX,
  cursorY,
  spotlightRadius = 260,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const revealDivRef = useRef<HTMLDivElement | null>(null)

  // Handle canvas sizing on mount and resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  // Render soft radial gradient mask onto canvas and apply directly to reveal layer
  useEffect(() => {
    const canvas = canvasRef.current
    const revealDiv = revealDivRef.current
    if (!canvas || !revealDiv) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width || window.innerWidth
    const height = canvas.height || window.innerHeight

    ctx.clearRect(0, 0, width, height)

    // If cursor is off-screen (e.g. init -999, -999), hide reveal layer
    if (cursorX < -500 || cursorY < -500) {
      revealDiv.style.opacity = '0'
      revealDiv.style.maskImage = 'none'
      revealDiv.style.webkitMaskImage = 'none'
      return
    }

    const gradient = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      spotlightRadius
    )

    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)')
    gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)')
    gradient.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, spotlightRadius, 0, Math.PI * 2)
    ctx.fill()

    try {
      const dataUrl = canvas.toDataURL('image/png')
      revealDiv.style.webkitMaskImage = `url("${dataUrl}")`
      revealDiv.style.maskImage = `url("${dataUrl}")`
      revealDiv.style.opacity = '1'
    } catch {
      // Direct CSS radial-gradient fallback if toDataURL is restricted
      const cssGradient = `radial-gradient(circle ${spotlightRadius}px at ${cursorX}px ${cursorY}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, rgba(255,255,255,0) 100%)`
      revealDiv.style.webkitMaskImage = cssGradient
      revealDiv.style.maskImage = cssGradient
      revealDiv.style.opacity = '1'
    }
  }, [cursorX, cursorY, spotlightRadius])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      <div
        ref={revealDivRef}
        className="absolute inset-0 bg-center bg-no-repeat z-30 pointer-events-none transition-opacity duration-200"
        style={{
          backgroundImage: `url("${image}")`,
          backgroundSize: 'min(86vw, 1380px) auto',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          opacity: 0,
        }}
      />
    </>
  )
}
