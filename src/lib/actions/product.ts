"use server";

import { prisma } from "@/lib/prisma";
import { ProductStatus, TipeItem } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface ProductInput {
  id?: string;
  name: string;
  categoryId: string;
  tipeItem: TipeItem;
  price: number;
  description: string;
  location: string;
  status: ProductStatus;
  mainImage: string;
  images: string[];
}

export interface ActionResponse {
  success: boolean;
  error?: string;
  data?: unknown;
}

export async function getProducts(params?: {
  categoryId?: string;
  status?: ProductStatus;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { categoryId, status, search, page = 1, limit = 10 } = params ?? {};

  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id }, include: { category: true } });
}

export async function createProduct(input: ProductInput): Promise<ActionResponse> {
  try {
    const isJasa = input.tipeItem === "JASA";
    if (!input.name || !input.categoryId || (!isJasa && !input.price) || !input.description || !input.location || !input.mainImage) {
      return { success: false, error: "Semua field wajib harus diisi" };
    }

    const product = await prisma.product.create({
      data: {
        name: input.name,
        categoryId: input.categoryId,
        tipeItem: input.tipeItem ?? TipeItem.ASET,
        price: input.price,
        description: input.description,
        location: input.location,
        status: input.status ?? ProductStatus.DRAFT,
        mainImage: input.mainImage,
        images: input.images ?? [],
      },
    });

    revalidatePath("/admin/produk");
    return { success: true, data: product };
  } catch (error) {
    console.error("[createProduct]", error);
    return { success: false, error: "Gagal menambahkan produk" };
  }
}

export async function updateProduct(id: string, input: ProductInput): Promise<ActionResponse> {
  try {
    if (!id) return { success: false, error: "ID produk tidak valid" };

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Produk tidak ditemukan" };

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: input.name,
        categoryId: input.categoryId,
        tipeItem: input.tipeItem,
        price: input.price,
        description: input.description,
        location: input.location,
        status: input.status,
        mainImage: input.mainImage,
        images: input.images ?? [],
      },
    });

    revalidatePath("/admin/produk");
    return { success: true, data: product };
  } catch (error) {
    console.error("[updateProduct]", error);
    return { success: false, error: "Gagal memperbarui produk" };
  }
}

export async function deleteProduct(id: string): Promise<ActionResponse> {
  try {
    if (!id) return { success: false, error: "ID produk tidak valid" };

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Produk tidak ditemukan" };

    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin/produk");
    return { success: true };
  } catch (error) {
    console.error("[deleteProduct]", error);
    return { success: false, error: "Gagal menghapus produk" };
  }
}

// ─── PUBLIC FUNCTIONS ──────────────────────────────────

export async function getLatestProducts(limit = 6) {
  return prisma.product.findMany({
    where: { status: "TERSEDIA" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getCatalogProducts(params?: {
  q?: string;
  kategori?: string;
  page?: number;
  limit?: number;
}) {
  const { q, kategori, page = 1, limit = 12 } = params ?? {};

  const where: Record<string, unknown> = {
    status: "TERSEDIA",
  };

  if (kategori) {
    where.category = { slug: kategori };
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── DASHBOARD STATS ──────────────────────────────────

export async function getDashboardStats() {
  const [
    totalProducts,
    totalProperti,
    totalKendaraan,
    totalTersedia,
    totalTerjual,
    latestProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { category: { slug: "properti" } } }),
    prisma.product.count({ where: { category: { slug: "kendaraan" } } }),
    prisma.product.count({ where: { status: "TERSEDIA" } }),
    prisma.product.count({ where: { status: "TERJUAL" } }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true },
    }),
  ]);

  return {
    totalProducts,
    totalProperti,
    totalKendaraan,
    totalTersedia,
    totalTerjual,
    latestProducts,
  };
}
