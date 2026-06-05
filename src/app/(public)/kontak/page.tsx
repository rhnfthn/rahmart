import { getWebSetting, getCompanyProfile } from "@/lib/actions/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Kontak - Rah-MART",
  description: "Hubungi Rah-MART via WhatsApp, email, atau media sosial",
};

export default async function KontakPage() {
  const [setting, profile] = await Promise.all([getWebSetting(), getCompanyProfile()]);

  const sosmed = (setting?.sosmedLinks as Record<string, string>) ?? {};

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-12 text-center space-y-3">
        <h1 className="text-3xl font-bold sm:text-4xl">Hubungi Kami</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Kami siap membantu Anda. Hubungi kami melalui salah satu kontak di bawah ini.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* WhatsApp */}
        {setting?.whatsapp && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💬</span> WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">{setting.whatsapp}</p>
              <Link href={`https://wa.me/${setting.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank">
                <Button className="w-full bg-[#25D366] hover:bg-[#1fb855]">Chat via WhatsApp</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Email */}
        {setting?.email && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📧</span> Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{setting.email}</p>
            </CardContent>
          </Card>
        )}

        {/* Alamat */}
        {setting?.address && (
          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📍</span> Alamat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{setting.address}</p>
            </CardContent>
          </Card>
        )}

        {/* Media Sosial */}
        {(sosmed.facebook || sosmed.instagram || sosmed.tiktok) && (
          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌐</span> Media Sosial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {sosmed.facebook && (
                  <Link href={sosmed.facebook} target="_blank">
                    <Button variant="outline">Facebook</Button>
                  </Link>
                )}
                {sosmed.instagram && (
                  <Link href={sosmed.instagram} target="_blank">
                    <Button variant="outline">Instagram</Button>
                  </Link>
                )}
                {sosmed.tiktok && (
                  <Link href={sosmed.tiktok} target="_blank">
                    <Button variant="outline">TikTok</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tentang Singkat */}
      {profile?.tentang && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tentang Rah-MART</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{profile.tentang}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
