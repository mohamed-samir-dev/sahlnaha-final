"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "./navbar";
import WhatsappButton from "./WhatsappButton";

export default function ClientLayout({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/invoice") || pathname.startsWith("/view-file");
  const isHome = pathname === "/";

  useEffect(() => {
    document.body.classList.toggle("home-page", isHome);
    return () => document.body.classList.remove("home-page");
  }, [isHome]);

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && footer}
      {!isAdmin && <WhatsappButton />}
    </>
  );
}
