import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "SRM Restaurant — Admin",
  description: "Admin dashboard for SRM Restaurant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: "var(--sidebar-w)", overflowX: "hidden" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
