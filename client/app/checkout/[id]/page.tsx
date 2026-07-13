import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import { formatRupiah } from "@/lib/format";
import CheckoutForm from "./checkout-form";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product || product.stok < 1) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-300 flex-1 px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold text-ink">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        <div className="flex items-start gap-4 rounded-xl border border-line p-4">
          <div className="relative aspect-square h-24 w-24 shrink-0 self-start overflow-hidden rounded-lg bg-line">
            <Image src={product.gambar} alt={product.nama} fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-ink">{product.nama}</h2>
            <p className="font-medium text-jet">{formatRupiah(product.harga)}</p>
            <p className="text-sm text-mid">Jumlah: 1</p>
          </div>
        </div>

        <CheckoutForm produkId={product.id} total={product.harga} />
      </div>
    </div>
  );
}
