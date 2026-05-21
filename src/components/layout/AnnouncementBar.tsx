'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ANNOUNCEMENTS } from '@/lib/data'

export function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENTS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setIndex((i) => (i - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)
  const next = () => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length)

  return (
    <div className="bg-[#4DB8D4] text-white text-sm py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={prev} className="opacity-70 hover:opacity-100 transition-opacity">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="text-center font-medium tracking-wide">
          {ANNOUNCEMENTS[index]}
        </p>
        <button onClick={next} className="opacity-70 hover:opacity-100 transition-opacity">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
