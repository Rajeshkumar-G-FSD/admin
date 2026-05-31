"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CREDS = { username: "SRM", password: "123456789" };

export default function LoginPage() {
  const router  = useRouter();
  const [user,  setUser]  = useState("");
  const [pass,  setPass]  = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Already logged in → go to dashboard
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("srm_auth")) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (user === CREDS.username && pass === CREDS.password) {
        localStorage.setItem("srm_auth", JSON.stringify({ username: user, name: "SRM Admin" }));
        router.replace("/");
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "#0f1117",
    }}>
      {/* ── Left: Hero branding ── */}
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "3rem",
        background: "linear-gradient(160deg, #13151f 0%, #1a1225 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}>
        {/* Decorative glow */}
        <div style={{
          position: "absolute",
          top: "20%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 400, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,200,66,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <img
          src="https://i.postimg.cc/KcQZk3yC/srmsweets.jpg"
          alt="SRM Restaurant"
          style={{
            width: 110, height: 110,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid rgba(245,200,66,0.45)",
            boxShadow: "0 0 40px rgba(245,200,66,0.2)",
          }}
        />

        {/* Restaurant name */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{
            fontSize: "2.4rem",
            fontWeight: 900,
            background: "linear-gradient(135deg,#fffbe6,#f5c842,#e8883a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
            margin: 0,
            lineHeight: 1.1,
          }}>
            SRM Restaurant
          </h1>
          <p style={{
            fontSize: "0.85rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginTop: "0.5rem",
          }}>
            &amp; Chat Items · Erode
          </p>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "80%", maxWidth: 280 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(245,200,66,0.25)" }} />
          <span style={{ color: "#f5c842", fontSize: "0.5rem" }}>◆</span>
          <div style={{ flex: 1, height: 1, background: "rgba(245,200,66,0.25)" }} />
        </div>

        {/* Info cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: 300 }}>
          {[
            { icon: "📍", text: "Palayapalayam, Erode, TN 638011" },
            { icon: "📞", text: "09524114433"                      },
            { icon: "🕐", text: "Open daily · 8 AM – 10 PM"        },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: "flex", alignItems: "center", gap: "0.65rem",
              padding: "0.65rem 1rem",
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.55)",
            }}>
              <span style={{ fontSize: "1rem" }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>

        {/* View website link */}
        <a
          href={process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:5175"}
          target="_blank"
          rel="noreferrer"
          style={{
            marginTop: "0.5rem",
            fontSize: "0.78rem",
            color: "#f5c842",
            textDecoration: "none",
            letterSpacing: "0.08em",
            borderBottom: "1px dashed rgba(245,200,66,0.4)",
            paddingBottom: "0.1rem",
          }}
        >
          🌐 View Customer Website →
        </a>
      </div>

      {/* ── Right: Login form ── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 2.5rem",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          {/* Heading */}
          <div style={{ marginBottom: "2.25rem" }}>
            <h2 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#fff", margin: 0 }}>
              Admin Login
            </h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: "0.4rem" }}>
              Sign in to manage your restaurant
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Username */}
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)",
                              letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Username
              </label>
              <input
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
                style={{
                  width: "100%", padding: "0.85rem 1rem",
                  background: "#1a1d2e",
                  border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)",
                              letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  style={{
                    width: "100%", padding: "0.85rem 3rem 0.85rem 1rem",
                    background: "#1a1d2e",
                    border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: "0.95rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: "absolute", right: "0.85rem", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(255,255,255,0.35)", fontSize: "0.9rem",
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "0.7rem 1rem",
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: 8,
                fontSize: "0.82rem",
                color: "#f87171",
              }}>
                ❌ {error}
              </div>
            )}

            {/* Hint */}
            <div style={{
              padding: "0.65rem 1rem",
              background: "rgba(245,200,66,0.06)",
              border: "1px solid rgba(245,200,66,0.15)",
              borderRadius: 8,
              fontSize: "0.78rem",
              color: "rgba(245,200,66,0.7)",
            }}>
              💡 Username: <strong>SRM</strong> &nbsp;·&nbsp; Password: <strong>123456789</strong>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "0.25rem",
                padding: "0.9rem",
                background: loading ? "rgba(245,200,66,0.4)" : "linear-gradient(135deg,#f5c842,#e8883a)",
                border: "none",
                borderRadius: 10,
                color: "#111",
                fontSize: "0.95rem",
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.04em",
                transition: "filter 0.2s",
              }}
            >
              {loading ? "Signing in…" : "Sign in to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
