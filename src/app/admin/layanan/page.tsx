import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLayananPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manajemen Layanan</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Layanan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Tabel layanan akan ditampilkan di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
}
