import Link from "next/link";
import { Search } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D92820]">
                <Search className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight font-heading">
                Rah<span className="text-[#D92820]">-MART</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              Platform katalog digital produk & jasa profesional terpercaya.
              Temukan kebutuhan Anda dengan mudah.
            </p>
          </div>

          {/* Navigasi */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40">Navigasi</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/" className="transition-colors hover:text-[#D92820]">Beranda</Link></li>
              <li><Link href="/katalog" className="transition-colors hover:text-[#D92820]">Katalog</Link></li>
              <li><Link href="/tentang-kami" className="transition-colors hover:text-[#D92820]">Tentang Kami</Link></li>
              <li><Link href="/kontak" className="transition-colors hover:text-[#D92820]">Kontak</Link></li>
            </ul>
          </div>

          {/* Layanan */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40">Layanan</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>Properti</li>
              <li>Otomotif</li>
              <li>Lifestyle</li>
              <li>Daily Product</li>
              <li>Jasa Perpajakan</li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40">Kontak</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>WhatsApp: 0896-4348-3985</li>
              <li>Email: info@rahmart.com</li>
              <li>Jakarta Selatan, Indonesia</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} Rah-MART. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="https://facebook.com" target="_blank" className="text-xs text-white/40 transition-colors hover:text-[#D92820]">Facebook</Link>
              <Link href="https://instagram.com" target="_blank" className="text-xs text-white/40 transition-colors hover:text-[#D92820]">Instagram</Link>
              <Link href="https://tiktok.com" target="_blank" className="text-xs text-white/40 transition-colors hover:text-[#D92820]">TikTok</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
