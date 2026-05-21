import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const collection = searchParams.get('collection')
  const featured = searchParams.get('featured')

  let products = [...PRODUCTS]
  if (category) products = products.filter((p) => p.category === category)
  if (collection) products = products.filter((p) => p.collection === collection)
  if (featured === 'true') products = products.filter((p) => p.featured)

  return NextResponse.json(products)
}
