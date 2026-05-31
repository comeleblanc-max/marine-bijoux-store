'use client'

import confetti from 'canvas-confetti'

/**
 * Petits confettis dorés + turquoise depuis un point précis de l'écran
 * (utilisé après "Ajouter au panier" pour donner un côté joyeux).
 */
export function celebrate(originX?: number, originY?: number) {
  if (typeof window === 'undefined') return

  const x = originX != null ? originX / window.innerWidth : 0.5
  const y = originY != null ? originY / window.innerHeight : 0.6

  const palette = ['#D4AF37', '#24BBD0', '#FAF5EA', '#0E4F5E']

  // Petit burst principal
  confetti({
    particleCount: 50,
    spread:        70,
    startVelocity: 35,
    origin:        { x, y },
    colors:        palette,
    scalar:        0.85,
    ticks:         180,
    gravity:       1.1,
    decay:         0.93,
  })

  // Mini burst additionnel (effet doublé subtil)
  setTimeout(() => {
    confetti({
      particleCount: 25,
      spread:        90,
      startVelocity: 25,
      origin:        { x, y: y - 0.05 },
      colors:        palette,
      scalar:        0.65,
      ticks:         150,
      gravity:       1.2,
      decay:         0.94,
    })
  }, 100)
}
