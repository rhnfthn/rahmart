import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  // 1. Admin
  const adminEmail = "admin@rahmart.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: { email: adminEmail, name: "Super Admin", password: hashedPassword, role: "SUPER_ADMIN" },
    });
    console.log(`Admin dibuat: ${adminEmail} / admin123`);
  }

  // 2. Kategori bawaan sesuai BRD
  const defaultCategories = [
    "Properti",
    "Kendaraan",
    "Jasa Perpajakan",
    "Rental Kendaraan",
    "Design Interior",
    "Travel Haji & Umroh",
  ];

  for (const name of defaultCategories) {
    const slug = toSlug(name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing) {
      await prisma.category.create({ data: { name, slug } });
      console.log(`Kategori dibuat: ${name}`);
    }
  }

  // 3. Company Profile kosong
  const existingProfile = await prisma.companyProfile.findFirst();
  if (!existingProfile) {
    await prisma.companyProfile.create({
      data: { tentang: "", visi: "", misi: "", keunggulan: "" },
    });
  }

  // 4. Web Setting kosong
  const existingSetting = await prisma.webSetting.findFirst();
  if (!existingSetting) {
    await prisma.webSetting.create({
      data: { whatsapp: "", email: "", address: "", sosmedLinks: {} },
    });
  }

  console.log("\nSeed selesai!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
