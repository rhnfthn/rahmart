import { getCategories } from "@/lib/actions/category";
import { CategoryTable } from "./components/category-table";

export default async function AdminKategoriPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Kategori</h1>
        <p className="text-sm text-muted-foreground">
          Kelola kategori produk. Saat ini ada {categories.length} kategori terdaftar.
        </p>
      </div>
      <CategoryTable categories={categories} />
    </div>
  );
}
