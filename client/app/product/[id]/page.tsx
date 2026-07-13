import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import { formatRupiah } from "@/lib/format";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const habis = product.stok < 1;

  return (
    <div className="mx-auto w-full max-w-300 flex-1 px-4 py-10 sm:px-8">
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-line bg-line">
          <Image
            src={product.gambar}
            alt={product.nama}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-ink">{product.nama}</h1>
          <p className="text-xl font-semibold text-jet">{formatRupiah(product.harga)}</p>
          <p className="text-mid">Stok tersedia: {product.stok}</p>

          {habis ? (
            <span className="mt-4 inline-flex w-fit rounded-lg border border-line px-5 py-3 font-medium text-mid">
              Stok habis
            </span>
          ) : (
            <Link
              href={`/checkout/${product.id}`}
              className="mt-4 inline-flex w-fit items-center justify-center rounded-lg bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-jet"
            >
              Beli Sekarang
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
