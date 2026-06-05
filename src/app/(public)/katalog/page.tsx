import Link from "next/link";
import Image from "next/image";
import { getCatalogProducts } from "@/lib/actions/product";
import { getCategories } from "@/lib/actions/category";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogFilters } from "./components/catalog-filters";

interface Props {
  searchParams: Promise<{ q?: string; kategori?: string; page?: string }>;
}

export default async function KatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q ?? "";
  const kategori = params.kategori ?? "";
  const page = Number(params.page) || 1;

  const [{ products, total, totalPages }, categories] = await Promise.all([
    getCatalogProducts({
      q: q || undefined,
      kategori: kategori || undefined,
      page,
      limit: 12,
    }),
    getCategories(),
  ]);

  function formatPrice(price: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Katalog Produk</h1>
        <p className="text-muted-foreground">
          Temukan properti & kendaraan berkualitas sesuai kebutuhan Anda.
        </p>
      </div>

      {/* Filters */}
      <CatalogFilters categories={categories} currentQ={q} currentKategori={kategori} />

      {/* Results info */}
      <div className="mb-6 text-sm text-muted-foreground">
        {total} produk ditemukan
        {q && (
          <> untuk &quot;<span className="font-medium text-foreground">{q}</span>&quot;</>
        )}
        {kategori && (
          <> dalam kategori <span className="font-medium text-foreground">{kategori}</span></>
        )}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">Tidak ada produk ditemukan.</p>
          <Link href="/katalog" className="mt-4 inline-block text-sm text-primary underline">
            Lihat semua produk
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/produk/${product.id}`}>
              <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                  <div className="pt-1">
                    <span className="text-sm font-medium text-primary hover:underline">
                      Lihat Detail →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const paginationParams = new URLSearchParams();
            if (q) paginationParams.set("q", q);
            if (kategori) paginationParams.set("kategori", kategori);
            paginationParams.set("page", String(p));

            return (
              <Link
                key={p}
                href={`/katalog?${paginationParams.toString()}`}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-accent"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
