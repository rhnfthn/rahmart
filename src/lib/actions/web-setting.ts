"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface WebSettingInput {
  whatsapp: string;
  email: string;
  address: string;
  sosmedLinks: Record<string, string>;
}

export interface ActionResponse {
  success: boolean;
  error?: string;
  data?: unknown;
}

export async function getWebSetting() {
  return prisma.webSetting.findFirst();
}

export async function upsertWebSetting(input: WebSettingInput): Promise<ActionResponse> {
  try {
    if (input.whatsapp && !/^[0-9]+$/.test(input.whatsapp.replace(/[^0-9]/g, ""))) {
      return { success: false, error: "Format nomor WhatsApp tidak valid" };
    }

    const existing = await prisma.webSetting.findFirst();

    let setting;
    if (existing) {
      setting = await prisma.webSetting.update({
        where: { id: existing.id },
        data: input,
      });
    } else {
      setting = await prisma.webSetting.create({ data: input });
    }

    revalidatePath("/admin/pengaturan");
    return { success: true, data: setting };
  } catch (error) {
    console.error("[upsertWebSetting]", error);
    return { success: false, error: "Gagal menyimpan pengaturan" };
  }
}
