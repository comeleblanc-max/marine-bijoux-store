import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <ProductForm
      mode="create"
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
        inStock:     true,
        featured:    false,
        newArrival:  true,
      }}
    />
  )
}
