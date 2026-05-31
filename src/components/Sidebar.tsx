"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",        icon: "▦",  label: "Dashboard" },
  { href: "/orders",  icon: "📋", label: "Orders"    },
  { href: "/menu",    icon: "🍽️", label: "Menu"      },
  { href: "/contact", icon: "📞", label: "Contact"   },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside style={{
      position: "fixed",
      top: 0, left: 0, bottom: 0,
      width: "var(--sidebar-w)",
      background: "#13151f",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: "1.25rem 1.25rem 1rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        gap: "0.65rem",
      }}>
        <img
          src="https://i.postimg.cc/KcQZk3yC/srmsweets.jpg"
          alt="SRM"
          style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover",
                   border: "1.5px solid rgba(245,200,66,0.4)" }}
        />
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
            SRM Restaurant
          </div>
          <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>
            ADMIN PANEL
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0.75rem" }}>
        {NAV.map(({ href, icon, label }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} style={{
              display: "flex",
              alignItems: "center",
              gap: "0.7rem",
              padding: "0.6rem 0.85rem",
              borderRadius: 8,
              marginBottom: "0.2rem",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: active ? 600 : 400,
              color: active ? "#fff" : "rgba(255,255,255,0.45)",
              background: active ? "rgba(245,200,66,0.1)" : "transparent",
              borderLeft: active ? "2px solid #f5c842" : "2px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: "1rem", lineHeight: 1 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "1rem 1.25rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        fontSize: "0.72rem",
        color: "rgba(255,255,255,0.25)",
      }}>
        Erode, Tamil Nadu · 09524114433
      </div>
    </aside>
  );
}
