"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready,  setReady]  = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("srm_auth");

    if (pathname === "/login") {
      // Already logged in → skip login screen
      if (auth) router.replace("/");
      else       setReady(true);
      return;
    }

    // Protected route — must be logged in
    if (!auth) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  if (!ready) {
    return (
      <div style={{
        minHeight: "100vh", width: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#0f1117",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "3px solid rgba(245,200,66,0.15)",
          borderTop: "3px solid #f5c842",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
