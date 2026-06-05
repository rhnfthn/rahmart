"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CompanyProfileInput {
  tentang: string;
  visi: string;
  misi: string;
  keunggulan: string;
}

export interface ActionResponse {
  success: boolean;
  error?: string;
  data?: unknown;
}

export async function getCompanyProfile() {
  return prisma.companyProfile.findFirst();
}

export async function upsertCompanyProfile(input: CompanyProfileInput): Promise<ActionResponse> {
  try {
    const existing = await prisma.companyProfile.findFirst();

    let profile;
    if (existing) {
      profile = await prisma.companyProfile.update({
        where: { id: existing.id },
        data: input,
      });
    } else {
      profile = await prisma.companyProfile.create({ data: input });
    }

    revalidatePath("/admin/company-profile");
    revalidatePath("/tentang-kami");
    return { success: true, data: profile };
  } catch (error) {
    console.error("[upsertCompanyProfile]", error);
    return { success: false, error: "Gagal menyimpan profil perusahaan" };
  }
}
