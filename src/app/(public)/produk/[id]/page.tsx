import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/lib/actions/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGallery } from "./components/product-gallery";
import { WhatsAppButton } from "./components/whatsapp-button";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Produk Tidak Ditemukan - Rah-MART" };

  return {
    title: `${product.name} - Rah-MART`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: product.mainImage, width: 1200, height: 630 }],
    },
  };
}

export default async function ProdukDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  function formatPrice(price: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  }

  const allImages = [product.mainImage, ...product.images.filter((img) => img !== product.mainImage)];

  const statusMap = {
    TERSEDIA: { label: "Tersedia", variant: "success" as const },
    TERJUAL: { label: "Terjual", variant: "secondary" as const },
    DRAFT: { label: "Draft", variant: "warning" as const },
  };

  const status = statusMap[product.status];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-2">/</span>
        <Link href="/katalog" className="hover:text-foreground">Katalog</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <ProductGallery images={allImages} productName={product.name} />

        {/* Info */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{product.category?.name}</Badge>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(Number(product.price))}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>📍</span>
              <span>{product.location}</span>
            </div>
          </div>

          <Card>
            <CardContent className="space-y-3 p-4">
              <h3 className="font-semibold">Deskripsi Produk</h3>
              <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>

          {/* WhatsApp CTA */}
          <WhatsAppButton
            productName={product.name}
            productPrice={formatPrice(Number(product.price))}
          />

          <Link href="/katalog">
            <Button variant="outline" className="w-full">
              ← Kembali ke Katalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
