import Image from "next/image";
import { getOrders } from "@/lib/api";
import { formatRupiah } from "@/lib/format";
import StatusBadge from "../components/StatusBadge";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="mx-auto w-full max-w-300 flex-1 px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold text-ink">Riwayat Pesanan</h1>
      <p className="mt-1 text-jet">Daftar transaksi yang pernah kamu buat.</p>

      {orders.length === 0 ? (
        <p className="mt-8 text-mid">Belum ada pesanan.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-4 rounded-xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="relative aspect-square h-16 w-16 shrink-0 self-start overflow-hidden rounded-lg bg-line">
                  <Image
                    src={order.produk.gambar}
                    alt={order.produk.nama}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold text-ink">{order.produk.nama}</h2>
                  <p className="text-sm text-mid">{order.namaPembeli}</p>
                  <p className="text-sm text-mid">
                    {new Date(order.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                <p className="font-medium text-jet">{formatRupiah(order.total)}</p>
                <StatusBadge status={order.statusPembayaran} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
