"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { label: "Manajemen Kategori", href: "/admin/kategori", icon: "🏷️" },
  { label: "Manajemen Produk", href: "/admin/produk", icon: "📦" },
  { label: "Manajemen Layanan", href: "/admin/layanan", icon: "🔧" },
  { label: "Company Profile", href: "/admin/company-profile", icon: "🏢" },
  { label: "Banner Beranda", href: "/admin/banner", icon: "🖼️" },
  { label: "Pengaturan Website", href: "/admin/pengaturan", icon: "⚙️" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-3 z-50 rounded-md border bg-background p-2 shadow-md md:hidden"
        aria-label="Toggle sidebar"
      >
        <span className="block h-0.5 w-5 bg-foreground transition-all" style={mobileOpen ? { transform: "translateY(6px) rotate(45deg)" } : {}} />
        <span className="block h-0.5 w-5 bg-foreground transition-all" style={mobileOpen ? { opacity: 0 } : { marginTop: "4px" }} />
        <span className="block h-0.5 w-5 bg-foreground transition-all" style={mobileOpen ? { transform: "translateY(-6px) rotate(-45deg)", marginTop: "-1px" } : { marginTop: "4px" }} />
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeMobile} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:static md:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin/dashboard" className="text-lg font-bold" onClick={closeMobile}>
            Rah-MART
            <span className="ml-2 text-xs font-normal text-muted-foreground">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={handleLogout}
          >
            🚪 Keluar
          </Button>
        </div>
      </aside>
    </>
  );
}
