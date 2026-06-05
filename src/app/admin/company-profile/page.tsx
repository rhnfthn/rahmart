import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCompanyProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Profile</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profil Perusahaan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Formulir编辑 company profile akan ditampilkan di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
}
