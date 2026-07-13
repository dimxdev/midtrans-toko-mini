import { getProducts } from "@/lib/api";
import ProductCard from "./components/ProductCard";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="mx-auto w-full max-w-300 flex-1 px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold text-ink">Produk</h1>
      <p className="mt-1 text-jet">Pilih produk yang mau kamu beli.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
