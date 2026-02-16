import { ProductShowcase } from "@/components/shop/product-list"
import { Reviews5 } from "@/components/shop/reviews"

export default function ShopPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <ProductShowcase />
        <Reviews5 />
      </div>
    </div>
  )
}
