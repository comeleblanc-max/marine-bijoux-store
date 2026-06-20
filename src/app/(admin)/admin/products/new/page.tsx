import { ProductForm } from '@/components/admin/ProductForm'
import { getCategories } from '@/lib/categories'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const categories = await getCategories()
  return (
    <ProductForm
      mode="create"
      categories={categories}
      initial={{
        name:        '',
        slug:        '',
        description: '',
        details:     '',
        price:       '',
        compareAt:   '',
        images:      [],
        category:    '',
        collection:  '',
        material:    'Acier inoxydable doré',
        stock:       '1',
        featured:    false,
        newArrival:  true,
      }}
    />
  )
}
