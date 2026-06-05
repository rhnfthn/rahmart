import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBannerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pengaturan Banner</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Manajemen banner akan ditampilkan di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
}
