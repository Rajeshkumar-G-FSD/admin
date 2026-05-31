const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:5175";

export default function ContactPage() {
  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: "#0f1117" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>Restaurant Info</h1>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>
          Public contact details shown on the customer website
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1.25rem" }}>
        {[
          { icon: "📍", label: "Address", value: "146, Perundurai Rd, EB Officer's Colony,\nPalayapalayam, Erode, Tamil Nadu 638011" },
          { icon: "📞", label: "Phone",   value: "09524114433" },
          { icon: "🕐", label: "Hours",   value: "Monday – Sunday\n8:00 AM – 10:00 PM" },
          { icon: "🌐", label: "Website", value: WEBSITE_URL },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{
            background: "#1a1d2e",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            padding: "1.5rem",
            display: "flex", gap: "1rem",
          }}>
            <span style={{ fontSize: "1.75rem", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
            <div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em",
                            textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</div>
              {label === "Website" ? (
                <a href={value} target="_blank" rel="noreferrer"
                   style={{ fontSize: "0.92rem", color: "#f5c842", textDecoration: "none",
                            lineHeight: 1.65, wordBreak: "break-all" }}>
                  {value}
                </a>
              ) : (
                <div style={{ fontSize: "0.92rem", color: "#fff", lineHeight: 1.65, whiteSpace: "pre-line" }}>
                  {value}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
