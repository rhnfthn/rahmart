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
import {
  createService,
  updateService,
  deleteService,
  ServiceInput,
} from "@/lib/actions/service";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string | null;
  isActive: boolean;
}

export function ServiceTable({ services }: { services: Service[] }) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const [form, setForm] = useState<ServiceInput>({
    name: "",
    description: "",
    image: undefined,
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function resetForm() {
    setForm({ name: "", description: "", image: undefined, isActive: true });
    setError("");
  }

  function openAdd() {
    setEditingService(null);
    resetForm();
    setDialogOpen(true);
  }

  function openEdit(svc: Service) {
    setEditingService(svc);
    setForm({
      name: svc.name,
      description: svc.description,
      image: svc.image ?? undefined,
      isActive: svc.isActive,
    });
    setError("");
    setDialogOpen(true);
  }

  function openDelete(svc: Service) {
    setDeletingService(svc);
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
    if (!form.name?.trim()) {
      setError("Nama layanan wajib diisi");
      return;
    }
    if (!form.description?.trim()) {
      setError("Deskripsi layanan wajib diisi");
      return;
    }

    setLoading(true);
    setError("");

    const result = editingService
      ? await updateService(editingService.id, form)
      : await createService(form);

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
    if (!deletingService) return;

    setLoading(true);
    const result = await deleteService(deletingService.id);
    setLoading(false);

    if (result.success) {
      setDeleteDialogOpen(false);
      setDeletingService(null);
      router.refresh();
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Layanan</CardTitle>
          <Button onClick={openAdd}>+ Tambah Layanan</Button>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Belum ada layanan.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead className="w-[80px]">Foto</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((svc, idx) => (
                  <TableRow key={svc.id}>
                    <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>
                      {svc.image ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                          <Image src={svc.image} alt={svc.name} fill className="object-cover" sizes="40px" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                          -
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{svc.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {svc.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={svc.isActive ? "success" : "secondary"}>
                        {svc.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(svc)}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => openDelete(svc)}
                        >
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
            <DialogTitle>{editingService ? "Edit Layanan" : "Tambah Layanan"}</DialogTitle>
            <DialogDescription>
              {editingService ? "Perbarui informasi layanan" : "Isi data layanan baru"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="svc-name">Nama Layanan *</Label>
              <Input
                id="svc-name"
                placeholder="Contoh: Jasa Perpajakan"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="svc-desc">Deskripsi *</Label>
              <Textarea
                id="svc-desc"
                placeholder="Deskripsi singkat layanan..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="svc-image">Foto Layanan</Label>
              <Input
                id="svc-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <p className="text-xs text-muted-foreground">Mengunggah...</p>}
              {form.image && (
                <div className="relative mt-2 h-20 w-20 overflow-hidden rounded-md border bg-muted">
                  <Image src={form.image} alt="Preview" fill className="object-cover" sizes="80px" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Label htmlFor="svc-active">Status</Label>
              <button
                id="svc-active"
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
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
            <AlertDialogTitle>Hapus Layanan?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deletingService?.name}&quot; akan dihapus permanen.
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
