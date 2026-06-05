import { getServices } from "@/lib/actions/service";
import { ServiceTable } from "./components/service-table";

export default async function AdminLayananPage() {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Layanan</h1>
        <p className="text-sm text-muted-foreground">
          Kelola layanan profesional Rah-MART. Saat ini ada {services.length} layanan terdaftar.
        </p>
      </div>
      <ServiceTable services={services} />
    </div>
  );
}
