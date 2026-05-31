import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import SidebarWrapper from "@/components/SidebarWrapper";
import MainWrapper from "@/components/MainWrapper";

export const metadata: Metadata = {
  title: "SRM Restaurant — Admin",
  description: "Admin dashboard for SRM Restaurant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: "flex", minHeight: "100vh" }}>
        <AuthGuard>
          <SidebarWrapper />
          <MainWrapper>{children}</MainWrapper>
        </AuthGuard>
      </body>
    </html>
  );
}
