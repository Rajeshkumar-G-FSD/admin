"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isLogin = path === "/login";
  return (
    <main style={{
      flex: 1,
      marginLeft: isLogin ? 0 : "var(--sidebar-w)",
      overflowX: "hidden",
    }}>
      {children}
    </main>
  );
}
