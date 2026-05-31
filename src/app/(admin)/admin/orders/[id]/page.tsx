import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { OrderDetailForm } from '@/components/admin/OrderDetailForm'

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const order = await db.order.findUnique({
    where:  { id },
    include: {
      items: true,
      user:  { select: { id: true, name: true, email: true } },
    },
  })

  if (!order) notFound()

  /* Sérialise pour passer au composant client */
  const data = {
    id:              order.id,
    email:           order.email,
    status:          order.status,
    total:           Number(order.total),
    shippingName:    order.shippingName,
    shippingAddress: order.shippingAddress,
    shippingCity:    order.shippingCity,
    shippingZip:     order.shippingZip,
    shippingCountry: order.shippingCountry,
    trackingNumber:  order.trackingNumber  ?? '',
    trackingCarrier: order.trackingCarrier ?? '',
    adminNote:       order.adminNote       ?? '',
    shippedAt:       order.shippedAt?.toISOString()   ?? null,
    deliveredAt:     order.deliveredAt?.toISOString() ?? null,
    createdAt:       order.createdAt.toISOString(),
    user: order.user ? { name: order.user.name, email: order.user.email } : null,
    items: order.items.map((it) => ({
      id:        it.id,
      name:      it.name,
      image:     it.image,
      quantity:  it.quantity,
      price:     Number(it.price),
      productId: it.productId,
    })),
  }

  return <OrderDetailForm initial={data} />
}
