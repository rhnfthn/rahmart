import Link from "next/link";
import Image from "next/image";
import { getLatestProducts } from "@/lib/actions/product";
import { getBanners } from "@/lib/actions/public";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomePage() {
  const [products, banners] = await Promise.all([getLatestProducts(6), getBanners()]);
  const banner = banners[0];

  function formatPrice(price: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  }

  return (
    <div className="space-y-16">
      {/* Hero / Banner */}
      <section className="relative overflow-hidden bg-muted">
        {banner ? (
          <div className="relative h-[400px] sm:h-[500px]">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="max-w-xl space-y-4">
                  <h1 className="text-3xl font-bold text-white sm:text-5xl">
                    {banner.title}
                  </h1>
                  {banner.description && (
                    <p className="text-lg text-white/80">{banner.description}</p>
                  )}
                  <Link href="/katalog">
                    <Button size="lg" className="mt-2">
                      Lihat Katalog
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-[400px] items-center justify-center sm:h-[500px]">
            <div className="text-center space-y-4 px-4">
              <h1 className="text-3xl font-bold sm:text-5xl">
                Find Everything You Need
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Platform katalog digital produk properti, kendaraan, dan jasa profesional.
                Temukan kebutuhan Anda dengan mudah.
              </p>
              <Link href="/katalog">
                <Button size="lg" className="mt-4">
                  Jelajahi Katalog
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Tagline */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold sm:text-3xl">Find Everything You Need</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Kami menyediakan berbagai pilihan produk properti & kendaraan berkualitas,
            serta layanan profesional untuk kebutuhan Anda.
          </p>
        </div>
      </section>

      {/* Produk Terbaru */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Produk Terbaru</h2>
          <Link href="/katalog">
            <Button variant="outline" size="sm">
              Lihat Semua
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">Belum ada produk tersedia.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link key={product.id} href={`/produk/${product.id}`}>
                <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {product.category?.name}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(Number(product.price))}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.location}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">Butuh Konsultasi?</h2>
          <p className="mt-3 text-primary-foreground/80">
            Hubungi kami via WhatsApp untuk informasi lebih lanjut.
          </p>
          <Link href="https://wa.me/6281234567890" target="_blank">
            <Button variant="secondary" size="lg" className="mt-6">
              Chat via WhatsApp
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
