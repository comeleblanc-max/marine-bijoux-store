import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProducts } from '@/lib/serialize'
import type { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category   = searchParams.get('category')
  const collection = searchParams.get('collection')
  const featured   = searchParams.get('featured')
  const query      = searchParams.get('q')

  const where: Prisma.ProductWhereInput = {}
  if (category)        where.category   = category
  if (collection)      where.collection = collection
  if (featured === 'true') where.featured = true
  if (query) {
    where.OR = [
      { name:        { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { category:    { contains: query, mode: 'insensitive' } },
    ]
  }

  const products = await db.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(serializeProducts(products))
}
