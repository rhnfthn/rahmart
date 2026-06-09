import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { getWebSetting } from "@/lib/actions/public";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./components/contact-form";

export const metadata = {
  title: "Kontak - Rah-MART",
  description: "Hubungi Rah-MART via WhatsApp, email, atau media sosial",
};

export default async function KontakPage() {
  const setting = await getWebSetting();
  const sosmed = (setting?.sosmedLinks as Record<string, string>) ?? {};

  return (
    <div className="space-y-20">
      {/* Header */}
      <section className="bg-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-4xl font-bold text-[#111111] sm:text-5xl font-heading">Hubungi Kami</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#111111]/60">
            Kami siap membantu Anda. Hubungi kami melalui salah satu kontak di bawah ini.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {setting?.whatsapp && (
            <Card className="border-[#111111]/5 bg-white">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D92820]/10">
                  <Phone className="h-6 w-6 text-[#D92820]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-[#111111] font-heading">WhatsApp</h3>
                  <p className="text-sm text-[#111111]/60">{setting.whatsapp}</p>
                  <Link href={`https://wa.me/${setting.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank">
                    <Button variant="link" className="h-auto p-0 text-[#D92820] text-sm">Chat Sekarang</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {setting?.email && (
            <Card className="border-[#111111]/5 bg-white">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D92820]/10">
                  <Mail className="h-6 w-6 text-[#D92820]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-[#111111] font-heading">Email</h3>
                  <p className="text-sm text-[#111111]/60">{setting.email}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {setting?.address && (
            <Card className="border-[#111111]/5 bg-white sm:col-span-2 lg:col-span-1">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D92820]/10">
                  <MapPin className="h-6 w-6 text-[#D92820]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-[#111111] font-heading">Alamat</h3>
                  <p className="text-sm text-[#111111]/60 whitespace-pre-line">{setting.address}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Form & Media Sosial */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-[#111111]/5 bg-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-[#111111] font-heading">Kirim Pesan</h2>
                <p className="mt-2 text-sm text-[#111111]/60">Isi formulir di bawah ini untuk menghubungi kami.</p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Media Sosial */}
          <div className="space-y-6">
            <Card className="border-[#111111]/5 bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D92820]/10">
                    <MessageCircle className="h-6 w-6 text-[#D92820]" />
                  </div>
                  <h3 className="font-semibold text-[#111111] font-heading">Media Sosial</h3>
                </div>
                <div className="space-y-3">
                  {sosmed.facebook && (
                    <Link href={sosmed.facebook} target="_blank" className="block text-sm text-[#111111]/60 transition-colors hover:text-[#D92820]">Facebook</Link>
                  )}
                  {sosmed.instagram && (
                    <Link href={sosmed.instagram} target="_blank" className="block text-sm text-[#111111]/60 transition-colors hover:text-[#D92820]">Instagram</Link>
                  )}
                  {sosmed.tiktok && (
                    <Link href={sosmed.tiktok} target="_blank" className="block text-sm text-[#111111]/60 transition-colors hover:text-[#D92820]">TikTok</Link>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#111111]/5 bg-[#111111]">
              <CardContent className="p-6 text-center space-y-3">
                <h3 className="font-semibold text-white font-heading">Butuh Bantuan?</h3>
                <p className="text-sm text-white/60">Hubungi kami langsung via WhatsApp untuk respons cepat.</p>
                <Link href="https://wa.me/6289643483985" target="_blank">
                  <Button className="w-full bg-[#D92820] text-white hover:bg-[#D92820]/90 rounded-xl">
                    Chat via WhatsApp
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
