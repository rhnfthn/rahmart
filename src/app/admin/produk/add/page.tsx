"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { createProduct, updateProduct, getProductById, ProductInput } from "@/lib/actions/product";
import { getCategories } from "@/lib/actions/category";
import { Category, ProductStatus, TipeItem } from "@prisma/client";

export default function AdminProdukFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ProductInput>({
    name: "",
    categoryId: "",
    tipeItem: "ASET",
    price: 0,
    description: "",
    location: "",
    status: "DRAFT",
    mainImage: "",
    images: [],
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (editId) {
      getProductById(editId).then((product) => {
        if (product) {
          setForm({
            name: product.name,
            categoryId: product.categoryId,
            tipeItem: product.tipeItem,
            price: Number(product.price),
            description: product.description,
            location: product.location,
            status: product.status,
            mainImage: product.mainImage,
            images: product.images,
          });
        }
      });
    }
  }, [editId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  }

  function handleTipeItemChange(value: TipeItem) {
    setForm((prev) => ({
      ...prev,
      tipeItem: value,
      price: value === "JASA" ? 0 : prev.price,
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append("files", file);
    }

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        setForm((prev) => {
          const newImages = [...prev.images, ...data.data];
          return {
            ...prev,
            images: newImages,
            mainImage: prev.mainImage || data.data[0],
          };
        });
      }
    } catch {
      setError("Gagal mengunggah gambar");
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveImage(index: number) {
    setForm((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        mainImage: prev.mainImage === prev.images[index] ? (newImages[0] ?? "") : prev.mainImage,
      };
    });
  }

  function handleSetMain(image: string) {
    setForm((prev) => ({ ...prev, mainImage: image }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = editId
        ? await updateProduct(editId, form)
        : await createProduct(form);

      if (result.success) {
        router.push("/admin/produk");
        router.refresh();
      } else {
        setError(result.error ?? "Terjadi kesalahan");
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{editId ? "Edit Produk" : "Tambah Produk Baru"}</h1>
        <p className="text-sm text-muted-foreground">
          {editId ? "Perbarui informasi produk" : "Isi data produk untuk ditambahkan ke katalog"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Tipe Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {(["ASET", "JASA"] as TipeItem[]).map((tipe) => (
                <label
                  key={tipe}
                  className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                    form.tipeItem === tipe
                      ? "border-[#D92820] bg-[#D92820]/5"
                      : "border-border hover:border-[#D92820]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipeItem"
                    value={tipe}
                    checked={form.tipeItem === tipe}
                    onChange={() => handleTipeItemChange(tipe)}
                    className="sr-only"
                  />
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      form.tipeItem === tipe ? "border-[#D92820]" : "border-muted-foreground/40"
                    }`}
                  >
                    {form.tipeItem === tipe && (
                      <div className="h-2.5 w-2.5 rounded-full bg-[#D92820]" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      {tipe === "ASET" ? "Aset Fisik" : "Jasa Profesional"}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {tipe === "ASET"
                        ? "Produk berupa barang fisik dengan harga pasti"
                        : "Layanan profesional, harga via konsultasi"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informasi Produk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk *</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Rumah Minimalis Modern"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Kategori *</Label>
                <Select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange} required>
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>

              {form.tipeItem === "ASET" ? (
                <div className="space-y-2">
                  <Label htmlFor="price">Harga (IDR) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    min={0}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Harga</Label>
                  <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                    Harga ditentukan via konsultasi admin
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi *</Label>
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Contoh: Jakarta Selatan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="DRAFT">Draft</option>
                <option value="TERSEDIA">Tersedia</option>
                <option value="TERJUAL">Terjual</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Deskripsi detail produk..."
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Foto Produk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="images">Upload Foto</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {uploading ? "Mengunggah..." : "Pilih satu atau lebih foto. Format: JPG, PNG, WebP."}
              </p>
            </div>

            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {form.images.map((img, idx) => (
                  <div key={idx} className="group relative">
                    <div className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                      <Image src={img} alt={`Foto ${idx + 1}`} fill className="object-cover" sizes="120px" />
                    </div>
                    <div className="absolute right-1 top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleSetMain(img)}
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                          form.mainImage === img
                            ? "bg-primary text-primary-foreground"
                            : "bg-background/80 text-foreground backdrop-blur-sm"
                        }`}
                      >
                        {form.mainImage === img ? "Utama" : "Set"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="rounded-full bg-destructive/80 px-1.5 py-0.5 text-[10px] font-medium text-destructive-foreground backdrop-blur-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={loading || uploading}>
            {loading ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah Produk"}
          </Button>
        </div>
      </form>
    </div>
  );
}
