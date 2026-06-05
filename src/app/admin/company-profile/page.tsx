"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getCompanyProfile, upsertCompanyProfile, CompanyProfileInput } from "@/lib/actions/company-profile";

export default function AdminCompanyProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState<CompanyProfileInput>({
    tentang: "",
    visi: "",
    misi: "",
    keunggulan: "",
  });

  useEffect(() => {
    getCompanyProfile().then((profile) => {
      if (profile) {
        setForm({
          tentang: profile.tentang,
          visi: profile.visi,
          misi: profile.misi,
          keunggulan: profile.keunggulan,
        });
      }
      setFetching(false);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await upsertCompanyProfile(form);

    setLoading(false);
    if (result.success) {
      setSuccess("Profil perusahaan berhasil disimpan");
      router.refresh();
    } else {
      setError(result.error ?? "Terjadi kesalahan");
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi profil perusahaan Rah-MART.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {success && (
          <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Tentang Kami</CardTitle>
            <CardDescription>Ceritakan tentang perusahaan Rah-MART</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tentang">Profil Perusahaan</Label>
              <Textarea
                id="tentang"
                name="tentang"
                value={form.tentang}
                onChange={handleChange}
                placeholder="Tuliskan profil singkat perusahaan..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Visi</CardTitle>
            <CardDescription>Visi perusahaan Rah-MART</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="visi">Visi</Label>
              <Textarea
                id="visi"
                name="visi"
                value={form.visi}
                onChange={handleChange}
                placeholder="Tuliskan visi perusahaan..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Misi</CardTitle>
            <CardDescription>Misi perusahaan Rah-MART</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="misi">Misi</Label>
              <Textarea
                id="misi"
                name="misi"
                value={form.misi}
                onChange={handleChange}
                placeholder="Tuliskan misi perusahaan..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Keunggulan</CardTitle>
            <CardDescription>Keunggulan layanan Rah-MART</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="keunggulan">Keunggulan</Label>
              <Textarea
                id="keunggulan"
                name="keunggulan"
                value={form.keunggulan}
                onChange={handleChange}
                placeholder="Tuliskan keunggulan perusahaan..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
