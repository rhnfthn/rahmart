import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "./components/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Login page tidak butuh session check — biarkan render
  // Kita cek dengan cara sederhana: login page tidak ada sidebar
  if (!session) {
    // Render login tanpa layout (login page handle sendiri)
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <header className="flex h-14 items-center border-b px-6">
          <p className="text-sm text-muted-foreground">
            Selamat datang, <span className="font-medium text-foreground">{session.email}</span>
          </p>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
