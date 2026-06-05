"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface BannerInput {
  id?: string;
  title: string;
  description?: string;
  image: string;
  ctaText?: string;
  isActive: boolean;
}

export interface ActionResponse {
  success: boolean;
  error?: string;
  data?: unknown;
}

export async function getBanners() {
  return prisma.banner.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getActiveBanners() {
  return prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBannerById(id: string) {
  return prisma.banner.findUnique({ where: { id } });
}

export async function createBanner(input: BannerInput): Promise<ActionResponse> {
  try {
    if (!input.title || !input.image) {
      return { success: false, error: "Judul dan gambar wajib diisi" };
    }

    const banner = await prisma.banner.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        image: input.image,
        ctaText: input.ctaText ?? null,
        isActive: input.isActive,
      },
    });

    revalidatePath("/admin/banner");
    return { success: true, data: banner };
  } catch (error) {
    console.error("[createBanner]", error);
    return { success: false, error: "Gagal menambahkan banner" };
  }
}

export async function updateBanner(id: string, input: BannerInput): Promise<ActionResponse> {
  try {
    if (!id) return { success: false, error: "ID tidak valid" };

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description ?? null,
        image: input.image,
        ctaText: input.ctaText ?? null,
        isActive: input.isActive,
      },
    });

    revalidatePath("/admin/banner");
    return { success: true, data: banner };
  } catch (error) {
    console.error("[updateBanner]", error);
    return { success: false, error: "Gagal memperbarui banner" };
  }
}

export async function deleteBanner(id: string): Promise<ActionResponse> {
  try {
    if (!id) return { success: false, error: "ID tidak valid" };

    await prisma.banner.delete({ where: { id } });

    revalidatePath("/admin/banner");
    return { success: true };
  } catch (error) {
    console.error("[deleteBanner]", error);
    return { success: false, error: "Gagal menghapus banner" };
  }
}
