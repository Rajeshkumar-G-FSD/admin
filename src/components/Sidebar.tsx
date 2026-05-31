"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/",        icon: "▦",  label: "Dashboard" },
  { href: "/orders",  icon: "📋", label: "Orders"    },
  { href: "/menu",    icon: "🍽️", label: "Menu"      },
  { href: "/contact", icon: "📞", label: "Contact"   },
];

export default function Sidebar() {
  const path   = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    try {
      const raw  = localStorage.getItem("srm_auth");
      if (raw) setUserName(JSON.parse(raw).name ?? "Admin");
    } catch {}
  }, []);

  const logout = () => {
    localStorage.removeItem("srm_auth");
    router.replace("/login");
  };

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
          style={{
            width: 36, height: 36, borderRadius: "50%",
            objectFit: "cover",
            border: "1.5px solid rgba(245,200,66,0.4)",
          }}
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
      <nav style={{ flex: 1, padding: "0.75rem" }}>
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

        {/* View customer website */}
        <a
          href={process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:5175"}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.7rem",
            padding: "0.6rem 0.85rem",
            borderRadius: 8,
            marginTop: "0.75rem",
            textDecoration: "none",
            fontSize: "0.85rem",
            color: "rgba(245,200,66,0.7)",
            background: "rgba(245,200,66,0.05)",
            borderLeft: "2px solid rgba(245,200,66,0.25)",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>🌐</span>
          View Website
        </a>
      </nav>

      {/* Logged-in user + logout */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "1rem",
      }}>
        {/* User chip */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          marginBottom: "0.75rem",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg,#f5c842,#e8883a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.78rem", fontWeight: 800, color: "#111",
            flexShrink: 0,
          }}>
            {userName.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#fff",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {userName}
            </div>
            <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>Administrator</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "0.5rem 0",
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 8,
            color: "#f87171",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.04em",
            transition: "background 0.15s",
          }}
        >
          Sign Out
        </button>

        <div style={{ marginTop: "0.65rem", fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
          Erode · 09524114433
        </div>
      </div>
    </aside>
  );
}
