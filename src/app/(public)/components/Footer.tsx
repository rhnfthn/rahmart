import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Rah-MART</h3>
            <p className="text-sm text-muted-foreground">
              Platform katalog digital produk & jasa profesional terpercaya.
            </p>
          </div>

          {/* Navigasi */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Navigasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Beranda</Link></li>
              <li><Link href="/katalog" className="hover:text-foreground">Katalog</Link></li>
              <li><Link href="/layanan" className="hover:text-foreground">Layanan</Link></li>
              <li><Link href="/tentang-kami" className="hover:text-foreground">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Layanan */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Layanan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Properti</li>
              <li>Kendaraan</li>
              <li>Jasa Perpajakan</li>
              <li>Desain Interior</li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Kontak</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>WhatsApp: 0812-3456-7890</li>
              <li>Email: info@rahmart.com</li>
              <li>Jakarta Selatan, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Rah-MART. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
