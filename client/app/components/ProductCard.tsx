import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/api";
import { formatRupiah } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group overflow-hidden rounded-xl border border-line bg-paper shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-line">
        <Image
          src={product.gambar}
          alt={product.nama}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h2 className="font-semibold text-ink">{product.nama}</h2>
        <p className="font-medium text-jet">{formatRupiah(product.harga)}</p>
        <p className="text-sm text-mid">Stok: {product.stok}</p>
      </div>
    </Link>
  );
}
