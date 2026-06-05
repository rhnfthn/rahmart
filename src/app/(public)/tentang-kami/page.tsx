import { getCompanyProfile } from "@/lib/actions/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Tentang Kami - Rah-MART",
  description: "Mengenal lebih dekat Rah-MART dan visi kami dalam menyediakan solusi digital terbaik.",
};

export default async function TentangKamiPage() {
  const profile = await getCompanyProfile();

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold sm:text-4xl">Tentang Kami</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Mengenal lebih dekat Rah-MART dan visi kami dalam menyediakan solusi digital terbaik.
        </p>
      </div>

      {/* Tentang */}
      <Card>
        <CardHeader>
          <CardTitle>Tentang Rah-MART</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
            {profile?.tentang || "Profil perusahaan belum tersedia."}
          </p>
        </CardContent>
      </Card>

      {/* Visi & Misi */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {profile?.visi || "Belum tersedia."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Misi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {profile?.misi || "Belum tersedia."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Keunggulan */}
      {profile?.keunggulan && (
        <Card>
          <CardHeader>
            <CardTitle>Keunggulan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {profile.keunggulan.split("\n").filter(Boolean).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="mt-0.5 text-lg">✅</span>
                  <p className="text-muted-foreground">{item.trim()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
