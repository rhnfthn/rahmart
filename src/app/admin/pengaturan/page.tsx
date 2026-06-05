"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getWebSetting, upsertWebSetting, WebSettingInput } from "@/lib/actions/web-setting";

export default function AdminPengaturanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState<WebSettingInput>({
    whatsapp: "",
    email: "",
    address: "",
    sosmedLinks: {
      facebook: "",
      instagram: "",
      tiktok: "",
    },
  });

  useEffect(() => {
    getWebSetting().then((setting) => {
      if (setting) {
        const sosmed = setting.sosmedLinks as Record<string, string>;
        setForm({
          whatsapp: setting.whatsapp ?? "",
          email: setting.email ?? "",
          address: setting.address ?? "",
          sosmedLinks: {
            facebook: sosmed?.facebook ?? "",
            instagram: sosmed?.instagram ?? "",
            tiktok: sosmed?.tiktok ?? "",
          },
        });
      }
      setFetching(false);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSosmedChange(platform: string, value: string) {
    setForm((prev) => ({
      ...prev,
      sosmedLinks: { ...prev.sosmedLinks, [platform]: value },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await upsertWebSetting(form);

    setLoading(false);
    if (result.success) {
      setSuccess("Pengaturan berhasil disimpan");
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
        <h1 className="text-2xl font-bold">Pengaturan Website</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi kontak dan media sosial Rah-MART.
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
            <CardTitle>Kontak</CardTitle>
            <CardDescription>Informasi kontak utama Rah-MART</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                placeholder="6289643483985"
                value={form.whatsapp ?? ""}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Format: 62xxxxxxxxxxx (tanpa spasi atau tanda baca)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="info@rahmart.com"
                value={form.email ?? ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                name="address"
                placeholder="Jakarta Selatan, Indonesia"
                value={form.address ?? ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Media Sosial</CardTitle>
            <CardDescription>Link media sosial Rah-MART</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/rahmart"
                value={form.sosmedLinks?.facebook ?? ""}
                onChange={(e) => handleSosmedChange("facebook", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/rahmart"
                value={form.sosmedLinks?.instagram ?? ""}
                onChange={(e) => handleSosmedChange("instagram", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok</Label>
              <Input
                id="tiktok"
                placeholder="https://tiktok.com/@rahmart"
                value={form.sosmedLinks?.tiktok ?? ""}
                onChange={(e) => handleSosmedChange("tiktok", e.target.value)}
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
