"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createBanner, updateBanner, deleteBanner, BannerInput } from "@/lib/actions/banner";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image: string;
  ctaText: string | null;
  isActive: boolean;
}

export function BannerTable({ banners }: { banners: Banner[] }) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);

  const [form, setForm] = useState<BannerInput>({
    title: "",
    description: "",
    image: "",
    ctaText: "",
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function resetForm() {
    setForm({ title: "", description: "", image: "", ctaText: "", isActive: true });
    setError("");
  }

  function openAdd() {
    setEditingBanner(null);
    resetForm();
    setDialogOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditingBanner(banner);
    setForm({
      title: banner.title,
      description: banner.description ?? "",
      image: banner.image,
      ctaText: banner.ctaText ?? "",
      isActive: banner.isActive,
    });
    setError("");
    setDialogOpen(true);
  }

  function openDelete(banner: Banner) {
    setDeletingBanner(banner);
    setDeleteDialogOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.data[0]) {
        setForm((prev) => ({ ...prev, image: data.data[0] }));
      }
    } catch {
      setError("Gagal mengunggah gambar");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.title?.trim()) {
      setError("Judul banner wajib diisi");
      return;
    }
    if (!form.image) {
      setError("Gambar banner wajib diunggah");
      return;
    }

    setLoading(true);
    setError("");

    const result = editingBanner
      ? await updateBanner(editingBanner.id, form)
      : await createBanner(form);

    setLoading(false);

    if (result.success) {
      setDialogOpen(false);
      resetForm();
      router.refresh();
    } else {
      setError(result.error ?? "Terjadi kesalahan");
    }
  }

  async function handleDelete() {
    if (!deletingBanner) return;

    setLoading(true);
    const result = await deleteBanner(deletingBanner.id);
    setLoading(false);

    if (result.success) {
      setDeleteDialogOpen(false);
      setDeletingBanner(null);
      router.refresh();
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Banner</CardTitle>
          <Button onClick={openAdd}>+ Tambah Banner</Button>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Belum ada banner.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead className="w-[100px]">Gambar</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>CTA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner, idx) => (
                  <TableRow key={banner.id}>
                    <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>
                      <div className="relative h-12 w-20 overflow-hidden rounded-md bg-muted">
                        <Image src={banner.image} alt={banner.title} fill className="object-cover" sizes="80px" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell className="max-w-[150px] truncate text-muted-foreground">
                      {banner.description ?? "-"}
                    </TableCell>
                    <TableCell>
                      {banner.ctaText ? <Badge variant="outline">{banner.ctaText}</Badge> : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={banner.isActive ? "success" : "secondary"}>
                        {banner.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(banner)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => openDelete(banner)}>
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog Tambah/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Banner" : "Tambah Banner"}</DialogTitle>
            <DialogDescription>
              {editingBanner ? "Perbarui data banner" : "Upload banner baru untuk beranda"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banner-title">Judul Banner *</Label>
              <Input
                id="banner-title"
                placeholder="Contoh: Properti Premium"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-desc">Deskripsi</Label>
              <Textarea
                id="banner-desc"
                placeholder="Deskripsi singkat banner..."
                rows={2}
                value={form.description ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-cta">Teks Tombol CTA</Label>
              <Input
                id="banner-cta"
                placeholder="Contoh: Lihat Katalog"
                value={form.ctaText ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, ctaText: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-image">Gambar Banner *</Label>
              <Input
                id="banner-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <p className="text-xs text-muted-foreground">Mengunggah...</p>}
              {form.image && (
                <div className="relative mt-2 h-24 w-40 overflow-hidden rounded-md border bg-muted">
                  <Image src={form.image} alt="Preview" fill className="object-cover" sizes="160px" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Label>Status Aktif</Label>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.isActive ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-muted-foreground">
                {form.isActive ? "Aktif" : "Nonaktif"}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={loading || uploading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Hapus */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Banner?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deletingBanner?.title}&quot; akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
