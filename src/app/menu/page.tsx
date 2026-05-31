import { MENU_ITEMS } from "@/data/mockData";

const CATEGORIES = [...new Set(MENU_ITEMS.map(m => m.category))];

export default function MenuPage() {
  const available   = MENU_ITEMS.filter(m =>  m.available).length;
  const unavailable = MENU_ITEMS.filter(m => !m.available).length;

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: "#0f1117" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>Menu Management</h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>
            <span style={{ color: "#34d399" }}>{available} available</span>
            &nbsp;·&nbsp;
            <span style={{ color: "#f87171" }}>{unavailable} unavailable</span>
          </p>
        </div>
        <button style={{
          padding: "0.6rem 1.25rem",
          background: "linear-gradient(135deg,#f5c842,#e8883a)",
          border: "none", borderRadius: 8,
          color: "#111", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
        }}>
          + Add Item
        </button>
      </div>

      {/* Per-category sections */}
      {CATEGORIES.map(cat => {
        const items = MENU_ITEMS.filter(m => m.category === cat);
        return (
          <div key={cat} style={{ marginBottom: "2rem" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              marginBottom: "0.85rem",
            }}>
              <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {cat}
              </h2>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>{items.length} items</span>
            </div>

            <div style={{
              background: "#1a1d2e",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              overflow: "hidden",
            }}>
              {items.map((item, idx) => (
                <div key={item.id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.9rem 1.25rem",
                  borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                }}>
                  {/* Emoji tile */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.4rem",
                  }}>
                    {item.emoji}
                  </div>

                  {/* Name + category */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>{item.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: "0.15rem" }}>
                      {item.orders} all-time orders
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", minWidth: 60, textAlign: "right" }}>
                    ₹{item.price}
                  </div>

                  {/* Orders bar */}
                  <div style={{ width: 80, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{
                      height: 4, borderRadius: 999, background: "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.min(100, (item.orders / 320) * 100)}%`,
                        background: item.available
                          ? "linear-gradient(90deg,#f5c842,#e8883a)"
                          : "rgba(255,255,255,0.2)",
                        borderRadius: 999,
                      }} />
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", textAlign: "right" }}>
                      {item.orders} orders
                    </div>
                  </div>

                  {/* Available toggle */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    fontSize: "0.78rem",
                    color: item.available ? "#34d399" : "#f87171",
                    minWidth: 90,
                    justifyContent: "flex-end",
                  }}>
                    <div style={{
                      width: 32, height: 18, borderRadius: 999,
                      background: item.available ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.1)",
                      position: "relative", cursor: "pointer", flexShrink: 0,
                    }}>
                      <div style={{
                        position: "absolute",
                        top: 2, left: item.available ? 16 : 2,
                        width: 14, height: 14, borderRadius: "50%",
                        background: item.available ? "#34d399" : "rgba(255,255,255,0.3)",
                        transition: "left 0.2s",
                      }} />
                    </div>
                    {item.available ? "Available" : "Off"}
                  </div>

                  {/* Edit button */}
                  <button style={{
                    padding: "0.3rem 0.75rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}>
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
