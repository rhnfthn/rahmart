"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ServiceInput {
  id?: string;
  name: string;
  description: string;
  image?: string;
  isActive: boolean;
}

export interface ActionResponse {
  success: boolean;
  error?: string;
  data?: unknown;
}

export async function getServices() {
  return prisma.service.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

export async function createService(input: ServiceInput): Promise<ActionResponse> {
  try {
    if (!input.name || !input.description) {
      return { success: false, error: "Nama dan deskripsi wajib diisi" };
    }

    const service = await prisma.service.create({
      data: {
        name: input.name,
        description: input.description,
        image: input.image ?? null,
        isActive: input.isActive,
      },
    });

    revalidatePath("/admin/layanan");
    return { success: true, data: service };
  } catch (error) {
    console.error("[createService]", error);
    return { success: false, error: "Gagal menambahkan layanan" };
  }
}

export async function updateService(id: string, input: ServiceInput): Promise<ActionResponse> {
  try {
    if (!id) return { success: false, error: "ID tidak valid" };

    const service = await prisma.service.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        image: input.image ?? null,
        isActive: input.isActive,
      },
    });

    revalidatePath("/admin/layanan");
    return { success: true, data: service };
  } catch (error) {
    console.error("[updateService]", error);
    return { success: false, error: "Gagal memperbarui layanan" };
  }
}

export async function deleteService(id: string): Promise<ActionResponse> {
  try {
    if (!id) return { success: false, error: "ID tidak valid" };

    await prisma.service.delete({ where: { id } });

    revalidatePath("/admin/layanan");
    return { success: true };
  } catch (error) {
    console.error("[deleteService]", error);
    return { success: false, error: "Gagal menghapus layanan" };
  }
}
