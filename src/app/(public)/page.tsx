import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { getLatestProducts } from "@/lib/actions/product";
import { getBanners, getCompanyProfile } from "@/lib/actions/public";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomePage() {
  const [products, banners, profile] = await Promise.all([
    getLatestProducts(6),
    getBanners(),
    getCompanyProfile(),
  ]);
  const banner = banners[0];

  function formatPrice(price: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  }

  return (
    <div className="space-y-24">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#D92820]/10 px-4 py-1.5 text-sm font-medium text-[#D92820]">
                  <Search className="h-4 w-4" />
                  Temukan Kebutuhan Anda
                </div>
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#111111] sm:text-5xl lg:text-6xl font-heading">
                  Find Everythings
                  <br />
                  You Need!
                </h1>
                <p className="max-w-lg text-lg leading-relaxed text-[#111111]/60">
                  Platform katalog digital produk properti, kendaraan, dan jasa
                  profesional. Temukan kebutuhan Anda dengan mudah.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/katalog">
                  <Button
                    size="lg"
                    className="bg-[#D92820] text-white hover:bg-[#D92820]/90 rounded-xl px-8"
                  >
                    Jelajahi Katalog
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image / Banner */}
<div className="relative">
  <pre className="text-xs overflow-auto max-w-full">
    {JSON.stringify(banner, null, 2)}
  </pre>

  {banner ? (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  ) : (
    <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-[#111111] shadow-2xl">
      Banner akan muncul di sini
    </div>
  )}
</div>

</div>
</div>
</section>

{/* ── KEUNGGULAN ── */}

      {/* ── KEUNGGULAN ── */}
      {profile?.keunggulan && (
        <section className="bg-[#F5F5F5]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold text-[#111111] sm:text-4xl font-heading">
                Keunggulan Rah-MART
              </h2>
              <p className="mx-auto max-w-2xl text-[#111111]/60">
                Mengapa harus memilih layanan kami?
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {profile.keunggulan
                .split("\n")
                .filter(Boolean)
                .map((item, idx) => (
                  <Card key={idx} className="border-[#111111]/5 bg-white">
                    <CardContent className="flex items-start gap-4 p-6">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D92820]" />
                      <p className="text-sm text-[#111111]/70">{item.trim()}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUK TERBARU ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-[#111111] font-heading">
            Produk Terbaru
          </h2>
          <Link href="/katalog">
            <Button variant="outline" size="sm" className="border-[#111111]/20">
              Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="py-16 text-center text-[#111111]/60">
            Belum ada produk tersedia.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link key={product.id} href={`/produk/${product.id}`}>
                <Card className="group overflow-hidden border-[#111111]/5 bg-white transition-all hover:shadow-lg">
                  <div className="relative aspect-[4/3] bg-[#F5F5F5] overflow-hidden">
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="space-y-3 p-5">
                    <h3 className="font-semibold text-[#111111] line-clamp-1 font-heading">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-[#D92820]">
                      {formatPrice(Number(product.price))}
                    </p>
                    <p className="text-sm text-[#111111]/60 line-clamp-1">
                      {product.location}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA WHATSAPP ── */}
      <section className="bg-[#111111]">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl font-heading">
            Butuh Konsultasi?
          </h2>
          <p className="mt-4 text-white/60">
            Hubungi kami via WhatsApp untuk informasi lebih lanjut.
          </p>
          <Link href="https://wa.me/6289643483985" target="_blank">
            <Button
              size="lg"
              className="mt-8 bg-[#D92820] text-white hover:bg-[#D92820]/90 rounded-xl px-10"
            >
              Chat via WhatsApp
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
