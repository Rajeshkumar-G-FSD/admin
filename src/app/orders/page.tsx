import StatusBadge from "@/components/StatusBadge";
import { ORDERS, type OrderStatus } from "@/data/mockData";

const TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All",       value: "all"       },
  { label: "Pending",   value: "pending"   },
  { label: "Preparing", value: "preparing" },
  { label: "Ready",     value: "ready"     },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const TYPE_COLOR: Record<string, string> = {
  "dine-in":  "#a78bfa",
  "takeaway": "#34d399",
  "delivery": "#60a5fa",
};

export default function OrdersPage() {
  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: "#0f1117" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>Orders</h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>
            {ORDERS.length} orders today
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {["dine-in", "takeaway", "delivery"].map(t => (
            <span key={t} style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "0.78rem", color: "rgba(255,255,255,0.5)",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: TYPE_COLOR[t] }} />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {TABS.map(tab => {
          const count = tab.value === "all"
            ? ORDERS.length
            : ORDERS.filter(o => o.status === tab.value).length;
          const isAll = tab.value === "all";
          return (
            <span key={tab.value} style={{
              padding: "0.4rem 1rem",
              borderRadius: 999,
              border: `1px solid ${isAll ? "rgba(245,200,66,0.4)" : "rgba(255,255,255,0.1)"}`,
              background: isAll ? "rgba(245,200,66,0.08)" : "transparent",
              fontSize: "0.8rem",
              color: isAll ? "#f5c842" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}>
              {tab.label} <strong style={{ color: isAll ? "#f5c842" : "rgba(255,255,255,0.7)" }}>{count}</strong>
            </span>
          );
        })}
      </div>

      {/* Orders table */}
      <div style={{
        background: "#1a1d2e",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["Order", "Customer", "Type", "Items", "Total", "Status", "Time", "Action"].map(h => (
                <th key={h} style={{
                  padding: "0.75rem 1.1rem",
                  textAlign: "left",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                {/* Order ID */}
                <td style={{ padding: "1rem 1.1rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f5c842" }}>{o.id}</div>
                </td>

                {/* Customer */}
                <td style={{ padding: "1rem 1.1rem" }}>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#fff" }}>{o.customer}</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: "0.15rem" }}>{o.phone}</div>
                </td>

                {/* Type */}
                <td style={{ padding: "1rem 1.1rem" }}>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 600,
                    color: TYPE_COLOR[o.type],
                    background: `${TYPE_COLOR[o.type]}15`,
                    padding: "0.2rem 0.55rem",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}>
                    {o.type}
                  </span>
                </td>

                {/* Items */}
                <td style={{ padding: "1rem 1.1rem", maxWidth: 220 }}>
                  {o.items.map((it, idx) => (
                    <div key={idx} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                      {it.qty}× {it.name}
                    </div>
                  ))}
                </td>

                {/* Total */}
                <td style={{ padding: "1rem 1.1rem" }}>
                  <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff" }}>₹{o.total}</span>
                </td>

                {/* Status */}
                <td style={{ padding: "1rem 1.1rem" }}>
                  <StatusBadge status={o.status} />
                </td>

                {/* Time */}
                <td style={{ padding: "1rem 1.1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                  {o.time}
                </td>

                {/* Action */}
                <td style={{ padding: "1rem 1.1rem" }}>
                  {(o.status === "pending" || o.status === "preparing") && (
                    <button style={{
                      padding: "0.35rem 0.85rem",
                      background: "rgba(245,200,66,0.1)",
                      border: "1px solid rgba(245,200,66,0.3)",
                      borderRadius: 6,
                      color: "#f5c842",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}>
                      {o.status === "pending" ? "Accept" : "Mark Ready"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
