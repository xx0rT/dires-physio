import { ProductCategories2 } from "@/components/shop/product-categories"
import { ProductList10 } from "@/components/shop/product-list"
import { Reviews5 } from "@/components/shop/reviews"

export default function ShopPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <ProductCategories2 />
        <ProductList10 />
        <Reviews5 />
      </div>
    </div>
  )
}
