import { Search, Eye, Target, CheckCircle2 } from "lucide-react";
import { getCompanyProfile } from "@/lib/actions/public";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Tentang Kami - Rah-MART",
  description: "Mengenal lebih dekat Rah-MART dan visi kami dalam menyediakan solusi digital terbaik.",
};

export default async function TentangKamiPage() {
  const profile = await getCompanyProfile();

  return (
    <div className="space-y-20">
      {/* Header */}
      <section className="bg-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-4xl font-bold text-[#111111] sm:text-5xl font-heading">Tentang Kami</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#111111]/60">
            Mengenal lebih dekat Rah-MART dan visi kami dalam menyediakan solusi digital terbaik.
          </p>
        </div>
      </section>

      {/* Tentang Section - Split Layout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image Left */}
          <div className="relative">
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-[#111111] shadow-xl">
              <div className="text-center space-y-4 px-8">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D92820]">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <p className="text-sm text-white/60">Profil Perusahaan</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-2xl bg-[#D92820]/10 -z-10" />
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-2xl bg-[#F5F5F5] -z-10" />
          </div>

          {/* Text Right */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#111111] font-heading">Tentang Rah-MART</h2>
            <div className="space-y-4 text-[#111111]/70 leading-relaxed">
              {profile?.tentang ? (
                profile.tentang.split("\n").filter(Boolean).map((paragraph, idx) => (
                  <p key={idx}>{paragraph.trim()}</p>
                ))
              ) : (
                <p>Profil perusahaan belum tersedia.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="border-[#111111]/5 bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D92820]/10">
                    <Eye className="h-6 w-6 text-[#D92820]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111111] font-heading">Visi</h3>
                </div>
                <p className="text-[#111111]/70 leading-relaxed whitespace-pre-line">
                  {profile?.visi || "Belum tersedia."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#111111]/5 bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D92820]/10">
                    <Target className="h-6 w-6 text-[#D92820]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111111] font-heading">Misi</h3>
                </div>
                <p className="text-[#111111]/70 leading-relaxed whitespace-pre-line">
                  {profile?.misi || "Belum tersedia."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      {profile?.keunggulan && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="mb-10 text-center text-3xl font-bold text-[#111111] font-heading">Keunggulan Kami</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.keunggulan.split("\n").filter(Boolean).map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl bg-[#F5F5F5] p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D92820]" />
                <p className="text-sm text-[#111111]/70">{item.trim()}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
