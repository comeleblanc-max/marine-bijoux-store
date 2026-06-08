'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ArrowUpDown, Check } from 'lucide-react'

interface Props {
  categories: { slug: string; label: string }[]
  activeCat:  string | null
  activeSort: string
  count:      number
}

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'manual',     label: 'Suggéré' },
  { value: 'new',        label: 'Nouveautés' },
  { value: 'price-asc',  label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
]

export function ShopFilters({ categories, activeCat, activeSort, count }: Props) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  function buildHref(next: { cat?: string | null; sort?: string }) {
    const params = new URLSearchParams(searchParams.toString())
    if (next.cat === undefined) {
      // pas touché
    } else if (next.cat === null) {
      params.delete('cat')
    } else {
      params.set('cat', next.cat)
    }
    if (next.sort) {
      if (next.sort === 'manual') params.delete('sort')
      else                         params.set('sort', next.sort)
    }
    const q = params.toString()
    return q ? `${pathname}?${q}` : pathname
  }

  function goto(next: { cat?: string | null; sort?: string }) {
    router.push(buildHref(next), { scroll: false })
  }

  /* Menu déroulant tri */
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const currentSort = SORT_OPTIONS.find((s) => s.value === activeSort) ?? SORT_OPTIONS[0]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      {/* Pastilles catégories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <Chip active={!activeCat} onClick={() => goto({ cat: null })}>Tous</Chip>
        {categories.map((c) => (
          <Chip
            key={c.slug}
            active={activeCat === c.slug}
            onClick={() => goto({ cat: c.slug })}
          >
            {c.label}
          </Chip>
        ))}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
        <span className="text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B]">
          {count} bijou{count > 1 ? 'x' : ''}
        </span>

        {/* Tri */}
        <div ref={wrapRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 border border-[#E8E2D5] hover:border-[#0E4F5E] text-sm text-[#0E4F5E] px-3 py-1.5 rounded-full transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{currentSort.label}</span>
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1.5 z-20 w-44 bg-white border border-[#E8E2D5] rounded-xl shadow-lg overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setOpen(false); goto({ sort: opt.value }) }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                    opt.value === currentSort.value
                      ? 'bg-[#FAF5EA] text-[#0E4F5E]'
                      : 'text-[#0E4F5E] hover:bg-[#FAF5EA]'
                  }`}
                >
                  {opt.label}
                  {opt.value === currentSort.value && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Chip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-full border transition-colors ${
        active
          ? 'bg-[#0E4F5E] border-[#0E4F5E] text-white'
          : 'border-[#E8E2D5] text-[#0E4F5E] hover:border-[#0E4F5E]'
      }`}
    >
      {children}
    </button>
  )
}
