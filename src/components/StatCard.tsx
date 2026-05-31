interface Props {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

export default function StatCard({ icon, label, value, sub, accent = "#f5c842" }: Props) {
  return (
    <div style={{
      background: "#1a1d2e",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14,
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${accent}22, transparent 70%)`,
        borderRadius: "0 14px 0 0",
      }} />
      <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{icon}</span>
      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "0.78rem", color: accent, fontWeight: 500 }}>{sub}</div>
      )}
    </div>
  );
}
