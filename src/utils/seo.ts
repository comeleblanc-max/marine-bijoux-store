import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://marineetladouceurdelete.com'
const BRAND = 'Marine et la douceur de l\'été'

export function buildMetadata({
  title,
  description,
  path = '',
  image,
  type = 'website',
}: {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article' | 'product'
}): Metadata {
  const fullTitle = title === BRAND ? title : `${title} — ${BRAND}`
  const url = `${BASE_URL}${path}`
  const ogImage = image || `${BASE_URL}/og-default.jpg`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: BRAND,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      type: type === 'product' ? 'website' : type,
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  }
}
