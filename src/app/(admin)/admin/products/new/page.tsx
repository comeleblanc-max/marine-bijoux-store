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
        stock:       '1',
        featured:    false,
        newArrival:  true,
      }}
    />
  )
}
