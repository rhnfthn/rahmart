import { getDashboardStats } from "@/lib/actions/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { title: "Total Produk", value: stats.totalProducts, icon: "📦" },
    { title: "Total Properti", value: stats.totalProperti, icon: "🏠" },
    { title: "Total Kendaraan", value: stats.totalKendaraan, icon: "🚗" },
    { title: "Total Layanan", value: stats.totalServices, icon: "🔧" },
    { title: "Produk Tersedia", value: stats.totalTersedia, icon: "✅" },
    { title: "Produk Terjual", value: stats.totalTerjual, icon: "💰" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <span className="text-2xl">{card.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
