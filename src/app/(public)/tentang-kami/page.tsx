import { getCompanyProfile } from "@/lib/actions/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            {profile?.about ?? "Profil perusahaan belum tersedia."}
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
              {profile?.vision ?? "Belum tersedia."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Misi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {profile?.mission ?? "Belum tersedia."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Kontak */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Hubungi Kami</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {profile.phone && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Telepon</dt>
                  <dd className="mt-1">{profile.phone}</dd>
                </div>
              )}
              {profile.email && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                  <dd className="mt-1">{profile.email}</dd>
                </div>
              )}
              {profile.address && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Alamat</dt>
                  <dd className="mt-1 whitespace-pre-line">{profile.address}</dd>
                </div>
              )}
              {profile.whatsapp && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">WhatsApp</dt>
                  <dd className="mt-1">{profile.whatsapp}</dd>
                </div>
              )}
              {profile.instagram && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Instagram</dt>
                  <dd className="mt-1">{profile.instagram}</dd>
                </div>
              )}
              {profile.facebook && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Facebook</dt>
                  <dd className="mt-1">{profile.facebook}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
