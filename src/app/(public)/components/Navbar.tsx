"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Katalog", href: "/katalog" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Kontak", href: "/kontak" },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo - Left */}
        <Logo />

        {/* Menu - Center (Desktop) */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#D92820]"
                    : "text-[#111111]/70 hover:text-[#111111]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[#D92820]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA - Right (Desktop) */}
        <div className="hidden md:block">
          <Link href="https://wa.me/6289643483985" target="_blank">
            <Button
              size="sm"
              className="bg-[#D92820] text-white hover:bg-[#D92820]/90 rounded-lg px-5"
            >
              Hubungi Kami
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#111111] transition-colors hover:bg-[#F5F5F5] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#D92820]/10 text-[#D92820]"
                      : "text-[#111111]/70 hover:bg-[#F5F5F5] hover:text-[#111111]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="https://wa.me/6289643483985"
              target="_blank"
              className="mt-3"
              onClick={() => setMobileOpen(false)}
            >
              <Button
                size="sm"
                className="w-full bg-[#D92820] text-white hover:bg-[#D92820]/90"
              >
                Hubungi Kami
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
