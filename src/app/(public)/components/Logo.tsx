import { Search } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "white";
}

export function Logo({ variant = "default" }: LogoProps) {
  const textColor = variant === "white" ? "text-white" : "text-[#111111]";

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D92820] transition-transform group-hover:scale-105">
        <Search className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <span className={`text-xl font-bold tracking-tight font-heading ${textColor}`}>
        Rah<span className="text-[#D92820]">-MART</span>
      </span>
    </Link>
  );
}
