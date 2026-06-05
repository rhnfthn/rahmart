import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/actions/product";
import { ProductStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductActions } from "./components/product-actions";

interface Props {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function AdminProdukPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const status = params.status as ProductStatus | undefined;

  const { products, total, totalPages } = await getProducts({
    page,
    limit: 10,
    search: search || undefined,
    status: status || undefined,
  });

  function formatPrice(price: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  }

  function statusBadge(status: ProductStatus) {
    const map: Record<ProductStatus, { label: string; variant: "success" | "warning" | "secondary" }> = {
      TERSEDIA: { label: "Tersedia", variant: "success" },
      TERJUAL: { label: "Terjual", variant: "secondary" },
      DRAFT: { label: "Draft", variant: "warning" },
    };
    const s = map[status];
    return <Badge variant={s.variant}>{s.label}</Badge>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <p className="text-sm text-muted-foreground">Total {total} produk terdaftar</p>
        </div>
        <Link href="/admin/produk/form">
          <Button>+ Tambah Produk</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Belum ada produk. Klik &quot;+ Tambah Produk&quot; untuk menambahkan.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Foto</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={product.mainImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category?.name ?? "-"}</Badge>
                      </TableCell>
                      <TableCell>{formatPrice(Number(product.price))}</TableCell>
                      <TableCell>{statusBadge(product.status)}</TableCell>
                      <TableCell className="text-right">
                        <ProductActions productId={product.id} productName={product.name} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/admin/produk?page=${p}${search ? `&search=${search}` : ""}`}
                    >
                      <Button variant={p === page ? "default" : "outline"} size="sm">
                        {p}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
