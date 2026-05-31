import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { ORDERS, STATS, MENU_ITEMS } from "@/data/mockData";

const s: React.CSSProperties = {
  padding: "2rem",
  minHeight: "100vh",
  background: "#0f1117",
};

export default function DashboardPage() {
  const recentOrders = ORDERS.slice(0, 5);
  const topItems     = [...MENU_ITEMS].sort((a, b) => b.orders - a.orders).slice(0, 5);

  return (
    <div style={s}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>Dashboard</h1>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>
          Today's overview — SRM Restaurant, Erode
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}>
        <StatCard icon="📋" label="Today's Orders"   value={STATS.todayOrders}            sub="↑ 12% vs yesterday"         accent="#f5c842" />
        <StatCard icon="₹"  label="Today's Revenue"  value={`₹${STATS.todayRevenue.toLocaleString()}`} sub="Avg ₹390 / order"  accent="#34d399" />
        <StatCard icon="⏳" label="Pending Orders"   value={STATS.pendingOrders}           sub="Needs attention"            accent="#fb923c" />
        <StatCard icon="🍽️" label="Menu Items"       value={STATS.menuItems}               sub="2 currently unavailable"   accent="#a78bfa" />
        <StatCard icon="⭐" label="Top Item Today"   value={STATS.topItem}                 sub="312 orders all-time"        accent="#f5c842" />
        <StatCard icon="📊" label="Avg Order Value"  value={`₹${STATS.avgOrderValue}`}    sub="Per transaction"            accent="#60a5fa" />
      </div>

      {/* Two-column: recent orders + top items */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>

        {/* Recent orders */}
        <div style={{
          background: "#1a1d2e",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          overflow: "hidden",
        }}>
          <div style={{
            padding: "1.1rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <h2 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>Recent Orders</h2>
            <a href="/orders" style={{ fontSize: "0.78rem", color: "#f5c842", textDecoration: "none" }}>View all →</a>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {["Order ID","Customer","Items","Total","Status","Time"].map(h => (
                  <th key={h} style={{
                    padding: "0.65rem 1rem",
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
              {recentOrders.map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "0.85rem 1rem", fontSize: "0.8rem", color: "#f5c842", fontWeight: 600 }}>{o.id}</td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <div style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 500 }}>{o.customer}</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{o.type}</div>
                  </td>
                  <td style={{ padding: "0.85rem 1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>
                    {o.items.map(it => it.name).join(", ").slice(0, 28)}{o.items.length > 1 ? "…" : ""}
                  </td>
                  <td style={{ padding: "0.85rem 1rem", fontSize: "0.88rem", fontWeight: 700, color: "#fff" }}>₹{o.total}</td>
                  <td style={{ padding: "0.85rem 1rem" }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: "0.85rem 1rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top selling items */}
        <div style={{
          background: "#1a1d2e",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          overflow: "hidden",
        }}>
          <div style={{
            padding: "1.1rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <h2 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>Top Items</h2>
            <a href="/menu" style={{ fontSize: "0.78rem", color: "#f5c842", textDecoration: "none" }}>Manage →</a>
          </div>

          <div style={{ padding: "0.75rem" }}>
            {topItems.map((item, i) => (
              <div key={item.id} style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                padding: "0.7rem 0.75rem",
                borderRadius: 10,
                marginBottom: "0.25rem",
                background: i === 0 ? "rgba(245,200,66,0.05)" : "transparent",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: "rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem",
                }}>
                  {item.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>
                    {item.orders} orders · ₹{item.price}
                  </div>
                </div>
                <div style={{
                  fontSize: "0.72rem", fontWeight: 700,
                  color: i === 0 ? "#f5c842" : "rgba(255,255,255,0.25)",
                  minWidth: 20, textAlign: "right",
                }}>
                  #{i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
