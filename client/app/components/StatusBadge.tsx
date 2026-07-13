import { PaymentStatus } from "@/lib/api";

const LABEL: Record<PaymentStatus, string> = {
  pending: "Pending",
  success: "Success",
  failed: "Failed",
  expired: "Expired",
};

const TEXT_COLOR: Record<PaymentStatus, string> = {
  pending: "text-amber-600",
  success: "text-green-600",
  failed: "text-red-600",
  expired: "text-red-600",
};

export default function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full bg-line px-3 py-1 text-xs font-semibold ${TEXT_COLOR[status]}`}
    >
      {LABEL[status]}
    </span>
  );
}
