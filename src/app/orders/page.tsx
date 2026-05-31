"use client";

import { useEffect, useState } from "react";
import {
  subscribeOrders, addOrder, updateOrderStatus, deleteOrder,
  seedOrdersIfEmpty,
  type Order, type OrderStatus, type NewOrder, type OrderItem,
} from "@/lib/orderService";

/* ── helpers ── */
const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All",       value: "all"       },
  { label: "Pending",   value: "pending"   },
  { label: "Preparing", value: "preparing" },
  { label: "Ready",     value: "ready"     },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_CFG: Record<OrderStatus, { color: string; bg: string; next?: OrderStatus; nextLabel?: string }> = {
  pending:   { color: "#f5c842", bg: "rgba(245,200,66,0.12)",  next: "preparing", nextLabel: "Accept"     },
  preparing: { color: "#fb923c", bg: "rgba(251,146,60,0.12)",  next: "ready",     nextLabel: "Mark Ready" },
  ready:     { color: "#34d399", bg: "rgba(52,211,153,0.12)",  next: "delivered", nextLabel: "Delivered"  },
  delivered: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)"                                              },
  cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.12)"                                             },
};

const TYPE_COLOR: Record<string, string> = {
  "dine-in":  "#a78bfa",
  "takeaway": "#34d399",
  "delivery": "#60a5fa",
};

const BLANK_ITEM: OrderItem = { name: "", qty: 1, price: 0 };
const BLANK_ORDER: NewOrder = {
  customer: "", phone: "", type: "dine-in",
  status: "pending", time: "", items: [{ ...BLANK_ITEM }], total: 0,
};

/* ─────────────────────────────────────────────────────────── */
export default function OrdersPage() {
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState<OrderStatus | "all">("all");
  const [showAdd,   setShowAdd]   = useState(false);
  const [form,      setForm]      = useState<NewOrder>(BLANK_ORDER);
  const [saving,    setSaving]    = useState(false);
  const [deletingId,setDeletingId]= useState<string | null>(null);

  /* Seed + subscribe */
  useEffect(() => {
    seedOrdersIfEmpty().catch(console.error);
    const unsub = subscribeOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  /* Derived */
  const filtered  = tab === "all" ? orders : orders.filter(o => o.status === tab);
  const pending   = orders.filter(o => o.status === "pending").length;
  const todayRev  = orders
    .filter(o => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  /* Compute total from items */
  const computedTotal = form.items.reduce((s, it) => s + (it.qty * it.price), 0);

  /* Item helpers */
  const setItem = (idx: number, key: keyof OrderItem, val: string | number) => {
    setForm(p => {
      const items = [...p.items];
      items[idx] = { ...items[idx], [key]: val };
      return { ...p, items };
    });
  };
  const addItem    = () => setForm(p => ({ ...p, items: [...p.items, { ...BLANK_ITEM }] }));
  const removeItem = (idx: number) =>
    setForm(p => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));

  /* Submit */
  const handleAdd = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    try {
      await addOrder({ ...form, total: computedTotal, time: now });
      setForm(BLANK_ORDER);
      setShowAdd(false);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (id: string, next: OrderStatus) => {
    await updateOrderStatus(id, next);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order from Firebase?")) return;
    setDeletingId(id);
    try { await deleteOrder(id); } finally { setDeletingId(null); }
  };

  /* ── UI ── */
  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: "#0f1117" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>Orders</h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>
            {loading ? "Connecting to Firebase…" : (
              <>{orders.length} orders · <span style={{ color: "#f5c842" }}>{pending} pending</span>
              {" · "}
              <span style={{ color: "#34d399" }}>₹{todayRev.toLocaleString()} revenue</span>
              {" · "}
              <span style={{ color: "rgba(255,255,255,0.25)" }}>Firestore live</span></>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: "0.65rem 1.35rem",
            background: "linear-gradient(135deg,#f5c842,#e8883a)",
            border: "none", borderRadius: 9,
            color: "#111", fontSize: "0.88rem", fontWeight: 800, cursor: "pointer",
          }}
        >
          + Add Order
        </button>
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {STATUS_TABS.map(({ label, value }) => {
          const count = value === "all" ? orders.length : orders.filter(o => o.status === value).length;
          const active = tab === value;
          return (
            <button key={value} onClick={() => setTab(value)} style={{
              padding: "0.42rem 1rem", borderRadius: 999, cursor: "pointer",
              border: `1px solid ${active ? "rgba(245,200,66,0.45)" : "rgba(255,255,255,0.1)"}`,
              background: active ? "rgba(245,200,66,0.1)" : "transparent",
              color: active ? "#f5c842" : "rgba(255,255,255,0.45)",
              fontSize: "0.78rem", fontWeight: active ? 700 : 400,
            }}>
              {label} <strong style={{ marginLeft: 3 }}>{count}</strong>
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.35)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", margin: "0 auto 1rem",
                        border: "3px solid rgba(245,200,66,0.15)", borderTop: "3px solid #f5c842",
                        animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Loading from Firebase…
        </div>
      )}

      {/* Orders table */}
      {!loading && (
        <div style={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.9rem" }}>
              No orders in this category.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["Order","Customer","Type","Items","Total","Status","Time","Actions"].map(h => (
                    <th key={h} style={{
                      padding: "0.72rem 1rem", textAlign: "left",
                      fontSize: "0.7rem", fontWeight: 600,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const cfg  = STATUS_CFG[o.status];
                  const fading = deletingId === o.id;
                  return (
                    <tr key={o.id} style={{
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                      opacity: fading ? 0.3 : 1, transition: "opacity 0.2s",
                    }}>
                      {/* ID */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#f5c842" }}>
                          {o.id.slice(0, 8).toUpperCase()}
                        </div>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#fff" }}>{o.customer}</div>
                        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>{o.phone}</div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <span style={{
                          fontSize: "0.72rem", fontWeight: 600,
                          color: TYPE_COLOR[o.type],
                          background: `${TYPE_COLOR[o.type]}18`,
                          padding: "0.2rem 0.55rem", borderRadius: 999, whiteSpace: "nowrap",
                        }}>
                          {o.type}
                        </span>
                      </td>

                      {/* Items */}
                      <td style={{ padding: "0.9rem 1rem", maxWidth: 200 }}>
                        {o.items.map((it, i) => (
                          <div key={i} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
                            {it.qty}× {it.name}
                          </div>
                        ))}
                      </td>

                      {/* Total */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff" }}>₹{o.total}</span>
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                          padding: "0.22rem 0.65rem", borderRadius: 999,
                          background: cfg.bg, color: cfg.color,
                          fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap",
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
                          {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                        </span>
                      </td>

                      {/* Time */}
                      <td style={{ padding: "0.9rem 1rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
                        {o.time}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          {cfg.next && (
                            <button
                              onClick={() => handleStatusUpdate(o.id, cfg.next!)}
                              style={{
                                padding: "0.3rem 0.75rem", borderRadius: 7,
                                border: "1px solid rgba(245,200,66,0.3)",
                                background: "rgba(245,200,66,0.08)",
                                color: "#f5c842", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {cfg.nextLabel}
                            </button>
                          )}
                          {o.status !== "cancelled" && o.status !== "delivered" && (
                            <button
                              onClick={() => handleStatusUpdate(o.id, "cancelled")}
                              style={{
                                padding: "0.3rem 0.55rem", borderRadius: 7,
                                border: "1px solid rgba(248,113,113,0.2)",
                                background: "rgba(248,113,113,0.06)",
                                color: "#f87171", fontSize: "0.72rem", cursor: "pointer",
                              }}
                            >
                              ✕
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(o.id)}
                            style={{
                              padding: "0.3rem 0.5rem", borderRadius: 7,
                              border: "1px solid rgba(255,255,255,0.08)",
                              background: "transparent",
                              color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", cursor: "pointer",
                            }}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Add Order Modal ── */}
      {showAdd && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}
        >
          <div style={{
            background: "#1a1d2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16, padding: "2rem",
            width: "100%", maxWidth: 520,
            maxHeight: "90vh", overflowY: "auto",
            animation: "slideUp 0.2s ease",
          }}>
            <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Add Order to Firebase</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: "1.1rem", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Customer */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <label style={LBL}>
                  Customer Name *
                  <input value={form.customer} onChange={e => setForm(p => ({ ...p, customer: e.target.value }))}
                    placeholder="e.g. Arun Kumar" required style={INP} />
                </label>
                <label style={LBL}>
                  Phone *
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="9876543210" required style={INP} />
                </label>
              </div>

              {/* Type */}
              <label style={LBL}>
                Order Type
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as NewOrder["type"] }))} style={{ ...INP, cursor: "pointer" }}>
                  <option value="dine-in">Dine-In</option>
                  <option value="takeaway">Takeaway</option>
                  <option value="delivery">Delivery</option>
                </select>
              </label>

              {/* Items */}
              <div>
                <div style={{ ...LBL, marginBottom: "0.5rem" }}>Order Items *</div>
                {form.items.map((it, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 52px 72px 28px", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <input value={it.name} onChange={e => setItem(idx, "name", e.target.value)}
                      placeholder="Item name" required style={{ ...INP, fontSize: "0.82rem" }} />
                    <input type="number" min={1} value={it.qty}
                      onChange={e => setItem(idx, "qty", Number(e.target.value))} style={{ ...INP, fontSize: "0.82rem", textAlign: "center" }} />
                    <input type="number" min={0} value={it.price || ""}
                      onChange={e => setItem(idx, "price", Number(e.target.value))}
                      placeholder="₹" required style={{ ...INP, fontSize: "0.82rem" }} />
                    {form.items.length > 1 && (
                      <button type="button" onClick={() => removeItem(idx)} style={{
                        background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
                        borderRadius: 7, color: "#f87171", cursor: "pointer", fontSize: "0.75rem",
                      }}>✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addItem} style={{
                  marginTop: "0.25rem", padding: "0.4rem 0.85rem",
                  background: "rgba(245,200,66,0.08)", border: "1px dashed rgba(245,200,66,0.3)",
                  borderRadius: 7, color: "#f5c842", fontSize: "0.78rem", cursor: "pointer",
                }}>
                  + Add Item
                </button>
              </div>

              {/* Total preview */}
              {computedTotal > 0 && (
                <div style={{
                  padding: "0.75rem 1rem", borderRadius: 9,
                  background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)",
                  fontSize: "0.88rem", color: "#34d399", fontWeight: 700,
                }}>
                  Total: ₹{computedTotal}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
                <button type="button" onClick={() => setShowAdd(false)} style={{
                  flex: 1, padding: "0.75rem",
                  background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 9, color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", cursor: "pointer",
                }}>Cancel</button>
                <button type="submit" disabled={saving} style={{
                  flex: 2, padding: "0.75rem",
                  background: saving ? "rgba(245,200,66,0.35)" : "linear-gradient(135deg,#f5c842,#e8883a)",
                  border: "none", borderRadius: 9,
                  color: "#111", fontSize: "0.88rem", fontWeight: 800, cursor: saving ? "not-allowed" : "pointer",
                }}>
                  {saving ? "Saving…" : "💾 Save to Firebase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const LBL: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: "0.35rem",
  fontSize: "0.72rem", color: "rgba(255,255,255,0.4)",
  letterSpacing: "0.06em", textTransform: "uppercase",
};
const INP: React.CSSProperties = {
  width: "100%", padding: "0.65rem 0.9rem",
  background: "#0f1117", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8, color: "#fff", fontSize: "0.88rem",
  outline: "none", boxSizing: "border-box",
};
