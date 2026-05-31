"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function SidebarWrapper() {
  const path = usePathname();
  if (path === "/login") return null;
  return <Sidebar />;
}
