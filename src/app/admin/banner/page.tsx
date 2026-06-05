import { getBanners } from "@/lib/actions/banner";
import { BannerTable } from "./components/banner-table";

export default async function AdminBannerPage() {
  const banners = await getBanners();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Banner Beranda</h1>
        <p className="text-sm text-muted-foreground">
          Kelola banner yang tampil di halaman beranda. Saat ini ada {banners.length} banner.
        </p>
      </div>
      <BannerTable banners={banners} />
    </div>
  );
}
