"use server";

import { prisma } from "@/lib/prisma";

export async function getBanners() {
  return prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllBanners() {
  return prisma.banner.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getCompanyProfile() {
  return prisma.companyProfile.findFirst();
}
