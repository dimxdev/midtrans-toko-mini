"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { createTransaction } from "@/lib/api";
import { formatRupiah } from "@/lib/format";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

const SNAP_URL =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

export default function CheckoutForm({
  produkId,
  total,
}: {
  produkId: number;
  total: number;
}) {
  const router = useRouter();
  const [snapReady, setSnapReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ namaPembeli: "", email: "", noHp: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!window.snap) {
      setError("Script pembayaran belum siap, coba lagi sebentar.");
      return;
    }

    setSubmitting(true);

    try {
      const { token } = await createTransaction({ produkId, ...form });

      window.snap.pay(token, {
        onSuccess: () => router.push("/orders"),
        onPending: () => router.push("/orders"),
        onError: () => setError("Pembayaran gagal, silakan coba lagi."),
        onClose: () =>
          setError("Kamu menutup popup pembayaran sebelum selesai. Coba lagi kalau mau lanjut."),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan, coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Script
        src={SNAP_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
        onReady={() => setSnapReady(true)}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-line p-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="namaPembeli" className="text-sm font-medium text-jet">
            Nama Lengkap
          </label>
          <input
            id="namaPembeli"
            required
            value={form.namaPembeli}
            onChange={(e) => setForm({ ...form, namaPembeli: e.target.value })}
            className="rounded-lg border border-line px-4 py-2 text-ink outline-none focus:border-ink"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-jet">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-line px-4 py-2 text-ink outline-none focus:border-ink"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="noHp" className="text-sm font-medium text-jet">
            No. HP
          </label>
          <input
            id="noHp"
            required
            value={form.noHp}
            onChange={(e) => setForm({ ...form, noHp: e.target.value })}
            className="rounded-lg border border-line px-4 py-2 text-ink outline-none focus:border-ink"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !snapReady}
          className="mt-2 rounded-lg bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-jet disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Memproses..." : `Bayar ${formatRupiah(total)}`}
        </button>
      </form>
    </>
  );
}
