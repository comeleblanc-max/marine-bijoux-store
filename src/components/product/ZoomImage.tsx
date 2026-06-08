'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

interface Props {
  src:       string
  alt:       string
  priority?: boolean
  zoom?:     number  // facteur de zoom (1.8 par défaut)
}

/**
 * Image avec zoom au survol : la souris fait office de "loupe".
 * - Desktop : hover → l'image se zoome, transform-origin suit le curseur.
 * - Touch    : pas de hover natif → ne déclenche rien, la photo reste normale.
 *              (Le clic peut être géré par un parent pour ouvrir une lightbox.)
 */
export function ZoomImage({ src, alt, priority, zoom = 1.8 }: Props) {
  const ref            = useRef<HTMLDivElement>(null)
  const [active, set]  = useState(false)
  const [pos, setPos]  = useState({ x: 50, y: 50 })

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width)  * 100))
    const y = Math.min(100, Math.max(0, ((e.clientY - r.top)  / r.height) * 100))
    setPos({ x, y })
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => set(true)}
      onMouseLeave={() => set(false)}
      onMouseMove={onMove}
      className="absolute inset-0 cursor-zoom-in"
    >
      <div
        className="absolute inset-0 transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform:       active ? `scale(${zoom})` : 'scale(1)',
          transformOrigin: `${pos.x}% ${pos.y}%`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  )
}
