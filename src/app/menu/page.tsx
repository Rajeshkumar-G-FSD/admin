"use client";

import { useEffect, useState } from "react";
import {
  subscribeMenuItems, addMenuItem, toggleAvailability,
  deleteMenuItem, seedIfEmpty, type MenuItem, type NewMenuItem,
} from "@/lib/menuService";

/* ── categories & emojis for the Add-Item form ── */
const CATEGORIES = ["Veg Snacks", "Tea-Time", "Fast Food", "Café Style", "Beverages"];
const EMOJI_LIST  = ["🧀","🥦","🌽","🌶️","🥔","🍟","🧄","🍔","🥪","🔺","💧","🍞","🥟","🍕","🌭","☕","🍋","🍃","🫙","🫕","🍝","🔥","⭐"];

const BLANK: NewMenuItem = {
  name: "", category: "Veg Snacks", price: 0, emoji: "🧀", available: true, orders: 0,
};

/* ─────────────────────────────────────────────────────────── */
export default function MenuPage() {
  const [items,    setItems]    = useState<MenuItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showAdd,  setShowAdd]  = useState(false);
  const [form,     setForm]     = useState<NewMenuItem>(BLANK);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search,   setSearch]   = useState("");
  const [catFilter,setCatFilter]= useState("All");

  /* Seed + subscribe */
  useEffect(() => {
    seedIfEmpty().catch(console.error);
    const unsub = subscribeMenuItems((data) => {
      setItems(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  /* Derived */
  const cats        = ["All", ...CATEGORIES];
  const filtered    = items.filter((it) =>
    (catFilter === "All" || it.category === catFilter) &&
    it.name.toLowerCase().includes(search.toLowerCase())
  );
  const grouped     = CATEGORIES.reduce<Record<string, MenuItem[]>>((acc, c) => {
    acc[c] = filtered.filter(it => it.category === c);
    return acc;
  }, {});
  const available   = items.filter(m =>  m.available).length;
  const unavailable = items.filter(m => !m.available).length;

  /* Handlers */
  const handleAdd = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || form.price <= 0) return;
    setSaving(true);
    try {
      await addMenuItem(form);
      setForm(BLANK);
      setShowAdd(false);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    await toggleAvailability(id, !current);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item from Firebase?")) return;
    setDeleting(id);
    try { await deleteMenuItem(id); } finally { setDeleting(null); }
  };

  /* ── UI ── */
  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: "#0f1117" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>Menu Management</h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>
            {loading ? "Loading from Firebase…" : (
              <><span style={{ color: "#34d399" }}>{available} available</span>
              {" · "}
              <span style={{ color: "#f87171" }}>{unavailable} unavailable</span>
              {" · "}
              <span style={{ color: "rgba(255,255,255,0.35)" }}>{items.length} total — Firestore live</span></>
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
            display: "flex", alignItems: "center", gap: "0.4rem",
          }}
        >
          + Add Item
        </button>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input
          placeholder="Search items…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: "0.55rem 0.95rem",
            background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, color: "#fff", fontSize: "0.88rem", outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{
              padding: "0.45rem 1rem", borderRadius: 999,
              border: `1px solid ${catFilter === c ? "rgba(245,200,66,0.5)" : "rgba(255,255,255,0.1)"}`,
              background: catFilter === c ? "rgba(245,200,66,0.1)" : "transparent",
              color: catFilter === c ? "#f5c842" : "rgba(255,255,255,0.45)",
              fontSize: "0.78rem", fontWeight: catFilter === c ? 700 : 400, cursor: "pointer",
            }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.35)", fontSize: "0.9rem" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", margin: "0 auto 1rem",
            border: "3px solid rgba(245,200,66,0.15)", borderTop: "3px solid #f5c842",
            animation: "spin 0.8s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Connecting to Firebase…
        </div>
      )}

      {/* Per-category sections */}
      {!loading && CATEGORIES.map(cat => {
        const catItems = grouped[cat];
        if (!catItems?.length) return null;
        return (
          <div key={cat} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <h2 style={{ fontSize: "0.82rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {cat}
              </h2>
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)" }}>{catItems.length} items</span>
            </div>

            <div style={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
              {catItems.map((item, idx) => (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "0.85rem 1.25rem",
                  borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                  opacity: deleting === item.id ? 0.4 : 1,
                  transition: "opacity 0.2s",
                }}>
                  {/* Emoji */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.35rem",
                  }}>
                    {item.emoji}
                  </div>

                  {/* Name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>{item.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.1rem" }}>
                      {item.orders} orders
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", minWidth: 56, textAlign: "right" }}>
                    ₹{item.price}
                  </div>

                  {/* Orders bar */}
                  <div style={{ width: 80 }}>
                    <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 999,
                        width: `${Math.min(100, (item.orders / 320) * 100)}%`,
                        background: item.available ? "linear-gradient(90deg,#f5c842,#e8883a)" : "rgba(255,255,255,0.15)",
                      }} />
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(item.id, item.available)}
                    title={item.available ? "Mark unavailable" : "Mark available"}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.45rem",
                      padding: "0.3rem 0.75rem", borderRadius: 999,
                      border: `1px solid ${item.available ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.1)"}`,
                      background: item.available ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.04)",
                      color: item.available ? "#34d399" : "rgba(255,255,255,0.3)",
                      fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%",
                                   background: item.available ? "#34d399" : "rgba(255,255,255,0.2)" }} />
                    {item.available ? "Available" : "Off"}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    style={{
                      padding: "0.3rem 0.6rem", borderRadius: 7,
                      border: "1px solid rgba(248,113,113,0.2)",
                      background: "rgba(248,113,113,0.06)",
                      color: "#f87171", fontSize: "0.78rem", cursor: "pointer",
                    }}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.25)", fontSize: "0.9rem" }}>
          No items found. Add your first item →
        </div>
      )}

      {/* ── Add Item Modal ── */}
      {showAdd && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem",
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}
        >
          <div style={{
            background: "#1a1d2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: "2rem",
            width: "100%", maxWidth: 460,
            animation: "slideUp 0.2s ease",
          }}>
            <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Add Menu Item</h2>
              <button onClick={() => setShowAdd(false)} style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.35)",
                fontSize: "1.1rem", cursor: "pointer", lineHeight: 1,
              }}>✕</button>
            </div>

            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Name */}
              <label style={LABEL}>
                Item Name *
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Cheese Balls"
                  required
                  style={INPUT}
                />
              </label>

              {/* Category */}
              <label style={LABEL}>
                Category *
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{ ...INPUT, cursor: "pointer" }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>

              {/* Price */}
              <label style={LABEL}>
                Price (₹) *
                <input
                  type="number" min={1} value={form.price || ""}
                  onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
                  placeholder="e.g. 150"
                  required
                  style={INPUT}
                />
              </label>

              {/* Emoji picker */}
              <div>
                <div style={LABEL_TEXT}>Emoji</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.4rem" }}>
                  {EMOJI_LIST.map(e => (
                    <button
                      key={e} type="button"
                      onClick={() => setForm(p => ({ ...p, emoji: e }))}
                      style={{
                        width: 38, height: 38, borderRadius: 8, border: "none",
                        background: form.emoji === e ? "rgba(245,200,66,0.2)" : "rgba(255,255,255,0.05)",
                        outline: form.emoji === e ? "2px solid #f5c842" : "none",
                        fontSize: "1.25rem", cursor: "pointer",
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available toggle */}
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <div
                  onClick={() => setForm(p => ({ ...p, available: !p.available }))}
                  style={{
                    width: 40, height: 22, borderRadius: 999, position: "relative",
                    background: form.available ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.1)",
                    transition: "background 0.2s", cursor: "pointer",
                  }}
                >
                  <div style={{
                    position: "absolute", top: 3,
                    left: form.available ? 21 : 3,
                    width: 16, height: 16, borderRadius: "50%",
                    background: form.available ? "#34d399" : "rgba(255,255,255,0.3)",
                    transition: "left 0.2s",
                  }} />
                </div>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
                  {form.available ? "Available now" : "Unavailable"}
                </span>
              </label>

              {/* Preview */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.85rem",
                padding: "0.85rem", borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: "rgba(245,200,66,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.4rem",
                }}>
                  {form.emoji}
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>{form.name || "Item name"}</div>
                  <div style={{ fontSize: "0.75rem", color: "#f5c842", fontWeight: 700 }}>₹{form.price || 0}</div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
                <button type="button" onClick={() => setShowAdd(false)} style={{
                  flex: 1, padding: "0.75rem",
                  background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 9, color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", cursor: "pointer",
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{
                  flex: 2, padding: "0.75rem",
                  background: saving ? "rgba(245,200,66,0.4)" : "linear-gradient(135deg,#f5c842,#e8883a)",
                  border: "none", borderRadius: 9,
                  color: "#111", fontSize: "0.88rem", fontWeight: 800, cursor: saving ? "not-allowed" : "pointer",
                }}>
                  {saving ? "Saving to Firebase…" : "💾 Add to Firebase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared styles ── */
const LABEL_TEXT: React.CSSProperties = {
  fontSize: "0.75rem", color: "rgba(255,255,255,0.45)",
  letterSpacing: "0.06em", textTransform: "uppercase",
  marginBottom: "0.4rem", display: "block",
};
const LABEL: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: "0.4rem",
  fontSize: "0.75rem", color: "rgba(255,255,255,0.45)",
  letterSpacing: "0.06em", textTransform: "uppercase",
};
const INPUT: React.CSSProperties = {
  width: "100%", padding: "0.75rem 0.95rem",
  background: "#0f1117", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 9, color: "#fff", fontSize: "0.92rem", outline: "none",
  boxSizing: "border-box",
};
