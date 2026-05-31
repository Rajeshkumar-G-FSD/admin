"use client";

import { useEffect, useState } from "react";
import { subscribeOrders, seedOrdersIfEmpty, type Order } from "@/lib/orderService";
import { subscribeMenuItems, seedIfEmpty, type MenuItem } from "@/lib/menuService";
import StatCard from "@/components/StatCard";

/* ── Status badge inline ── */
type OrderStatus = Order["status"];
const STATUS_COLOR: Record<OrderStatus, { color: string; bg: string }> = {
  pending:   { color: "#f5c842", bg: "rgba(245,200,66,0.12)"  },
  preparing: { color: "#fb923c", bg: "rgba(251,146,60,0.12)"  },
  ready:     { color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
  delivered: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
  cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

export default function DashboardPage() {
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    // Seed both collections if empty, then subscribe for real-time updates
    Promise.all([seedOrdersIfEmpty(), seedIfEmpty()]).catch(console.error);

    let ordersReady = false;
    let menuReady   = false;
    const checkReady = () => { if (ordersReady && menuReady) setLoading(false); };

    const unsubOrders = subscribeOrders((data) => {
      setOrders(data);
      ordersReady = true;
      checkReady();
    });
    const unsubMenu = subscribeMenuItems((data) => {
      setMenuItems(data);
      menuReady = true;
      checkReady();
    });

    return () => { unsubOrders(); unsubMenu(); };
  }, []);

  /* ── Derived stats ── */
  const active        = orders.filter(o => o.status !== "cancelled");
  const todayRevenue  = active.reduce((s, o) => s + o.total, 0);
  const pending       = orders.filter(o => o.status === "pending").length;
  const avgOrder      = active.length ? Math.round(todayRevenue / active.length) : 0;
  const topItem       = [...menuItems].sort((a, b) => b.orders - a.orders)[0];
  const recentOrders  = orders.slice(0, 6);
  const topItems      = [...menuItems].sort((a, b) => b.orders - a.orders).slice(0, 5);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%",
                      border: "3px solid rgba(245,200,66,0.15)", borderTop: "3px solid #f5c842",
                      animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>Connecting to Firebase…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: "#0f1117" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>Dashboard</h1>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>
          Live from Firebase · SRM Restaurant, Erode
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard icon="📋" label="Total Orders"     value={orders.length}                        sub={`${pending} pending`}             accent="#f5c842" />
        <StatCard icon="₹"  label="Total Revenue"    value={`₹${todayRevenue.toLocaleString()}`} sub={`${active.length} completed`}     accent="#34d399" />
        <StatCard icon="⏳" label="Pending"          value={pending}                              sub="Needs attention"                  accent="#fb923c" />
        <StatCard icon="🍽️" label="Menu Items"       value={menuItems.length}                    sub={`${menuItems.filter(m=>!m.available).length} unavailable`} accent="#a78bfa" />
        <StatCard icon="⭐" label="Top Item"         value={topItem?.name ?? "—"}                sub={`${topItem?.orders ?? 0} orders`} accent="#f5c842" />
        <StatCard icon="📊" label="Avg Order"        value={avgOrder ? `₹${avgOrder}` : "—"}     sub="Per transaction"                  accent="#60a5fa" />
      </div>

      {/* Two-column: orders + top items */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem" }}>

        {/* Recent orders */}
        <div style={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "1.1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)",
                        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>Recent Orders</h2>
            <a href="/orders" style={{ fontSize: "0.78rem", color: "#f5c842", textDecoration: "none" }}>View all →</a>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.85rem" }}>
              No orders yet. Add one from the Orders page.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["ID","Customer","Items","Total","Status","Time"].map(h => (
                    <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left",
                      fontSize: "0.7rem", fontWeight: 600,
                      color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em",
                      textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => {
                  const cfg = STATUS_COLOR[o.status];
                  return (
                    <tr key={o.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "0.85rem 1rem", fontSize: "0.75rem", fontWeight: 700, color: "#f5c842" }}>
                        {o.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "#fff" }}>{o.customer}</div>
                        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>{o.type}</div>
                      </td>
                      <td style={{ padding: "0.85rem 1rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                        {o.items.map(it => `${it.qty}× ${it.name}`).join(", ").slice(0, 32)}…
                      </td>
                      <td style={{ padding: "0.85rem 1rem", fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>₹{o.total}</td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                          padding: "0.2rem 0.6rem", borderRadius: 999,
                          background: cfg.bg, color: cfg.color,
                          fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap",
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color }} />
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem 1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{o.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Top items */}
        <div style={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "1.1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)",
                        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>Top Items</h2>
            <a href="/menu" style={{ fontSize: "0.78rem", color: "#f5c842", textDecoration: "none" }}>Manage →</a>
          </div>

          <div style={{ padding: "0.75rem" }}>
            {topItems.length === 0 ? (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.82rem" }}>
                No menu items yet.
              </div>
            ) : topItems.map((item, i) => (
              <div key={item.id} style={{
                display: "flex", alignItems: "center", gap: "0.85rem",
                padding: "0.65rem 0.75rem", borderRadius: 10, marginBottom: "0.25rem",
                background: i === 0 ? "rgba(245,200,66,0.05)" : "transparent",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem",
                }}>
                  {item.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
                    {item.orders} orders · ₹{item.price}
                  </div>
                </div>
                <span style={{
                  fontSize: "0.72rem", fontWeight: 700,
                  color: i === 0 ? "#f5c842" : "rgba(255,255,255,0.2)",
                }}>
                  #{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
