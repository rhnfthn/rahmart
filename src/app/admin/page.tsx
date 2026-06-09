import Link from "next/link";
import Image from "next/image";
import { getDashboardStats } from "@/lib/actions/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  function formatPrice(price: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Statistik */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Produk", value: stats.totalProducts, icon: "📦" },
          { title: "Total Properti", value: stats.totalProperti, icon: "🏠" },
          { title: "Total Kendaraan", value: stats.totalKendaraan, icon: "🚗" },
          { title: "Produk Tersedia", value: stats.totalTersedia, icon: "✅" },
        ].map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <span className="text-2xl">{card.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produk Aktif (Tersedia)</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTersedia}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produk Terjual</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTerjual}</div>
          </CardContent>
        </Card>
      </div>

      {/* Produk Terbaru */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Produk Terbaru</CardTitle>
          <Link href="/admin/produk" className="text-sm text-primary hover:underline">
            Lihat Semua →
          </Link>
        </CardHeader>
        <CardContent>
          {stats.latestProducts.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">Belum ada produk.</p>
          ) : (
            <div className="space-y-3">
              {stats.latestProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 rounded-md border p-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                    <Image src={product.mainImage} alt={product.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category?.name} · {formatPrice(Number(product.price))}
                    </p>
                  </div>
                  <Badge variant={product.status === "TERSEDIA" ? "success" : product.status === "TERJUAL" ? "secondary" : "warning"}>
                    {product.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
