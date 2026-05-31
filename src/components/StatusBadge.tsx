import type { OrderStatus } from "@/data/mockData";

const CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: "Pending",   color: "#f5c842", bg: "rgba(245,200,66,0.12)"  },
  preparing: { label: "Preparing", color: "#fb923c", bg: "rgba(251,146,60,0.12)"  },
  ready:     { label: "Ready",     color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
  delivered: { label: "Delivered", color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
  cancelled: { label: "Cancelled", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, color, bg } = CONFIG[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.35rem",
      padding: "0.22rem 0.65rem",
      borderRadius: 999,
      background: bg,
      color,
      fontSize: "0.72rem",
      fontWeight: 700,
      letterSpacing: "0.05em",
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
      {label}
    </span>
  );
}
