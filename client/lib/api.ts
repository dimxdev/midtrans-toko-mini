const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Product = {
  id: number;
  nama: string;
  harga: number;
  gambar: string;
  stok: number;
};

export type CreateTransactionPayload = {
  produkId: number;
  namaPembeli: string;
  email: string;
  noHp: string;
};

export type CreateTransactionResponse = {
  orderId: number;
  orderIdMidtrans: string;
  token: string;
  redirectUrl: string;
};

export type PaymentStatus = "pending" | "success" | "failed" | "expired";

export type Order = {
  id: number;
  namaPembeli: string;
  email: string;
  noHp: string;
  produkId: number;
  total: number;
  statusPembayaran: PaymentStatus;
  orderIdMidtrans: string | null;
  createdAt: string;
  produk: Product;
};

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Gagal mengambil daftar produk");
  }

  return res.json();
}

export async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Gagal mengambil detail produk");
  }

  return res.json();
}

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${API_URL}/orders`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Gagal mengambil riwayat pesanan");
  }

  return res.json();
}

export async function createTransaction(
  payload: CreateTransactionPayload,
): Promise<CreateTransactionResponse> {
  const res = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : (body?.message ?? "Gagal membuat transaksi");
    throw new Error(message);
  }

  return res.json();
}
