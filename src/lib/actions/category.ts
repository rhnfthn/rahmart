"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CategoryInput {
  id?: string;
  name: string;
}

export interface ActionResponse {
  success: boolean;
  error?: string;
  data?: unknown;
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function createCategory(input: CategoryInput): Promise<ActionResponse> {
  try {
    if (!input.name?.trim()) {
      return { success: false, error: "Nama kategori wajib diisi" };
    }

    const slug = toSlug(input.name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Kategori dengan nama serupa sudah ada" };
    }

    const category = await prisma.category.create({
      data: { name: input.name.trim(), slug },
    });

    revalidatePath("/admin/kategori");
    return { success: true, data: category };
  } catch (error) {
    console.error("[createCategory]", error);
    return { success: false, error: "Gagal menambahkan kategori" };
  }
}

export async function updateCategory(id: string, input: CategoryInput): Promise<ActionResponse> {
  try {
    if (!id) return { success: false, error: "ID tidak valid" };
    if (!input.name?.trim()) {
      return { success: false, error: "Nama kategori wajib diisi" };
    }

    const slug = toSlug(input.name);

    const existing = await prisma.category.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Kategori dengan nama serupa sudah ada" };
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name: input.name.trim(), slug },
    });

    revalidatePath("/admin/kategori");
    return { success: true, data: category };
  } catch (error) {
    console.error("[updateCategory]", error);
    return { success: false, error: "Gagal memperbarui kategori" };
  }
}

export async function deleteCategory(id: string): Promise<ActionResponse> {
  try {
    if (!id) return { success: false, error: "ID tidak valid" };

    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return {
        success: false,
        error: `Tidak bisa hapus. Masih ada ${productCount} produk menggunakan kategori ini`,
      };
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/kategori");
    return { success: true };
  } catch (error) {
    console.error("[deleteCategory]", error);
    return { success: false, error: "Gagal menghapus kategori" };
  }
}
