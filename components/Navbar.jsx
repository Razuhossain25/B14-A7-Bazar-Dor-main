"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import useProducts from "@/lib/useProducts";
import { banglaDate, fmtPrice, fmtPct, getChangeDir } from "@/lib/utils";

function Ticker() {
  const { products } = useProducts();
  if (!products.length) return <div className="h-9 bg-neutral" />;
  const items = [...products, ...products];

  return (
    <div className="bg-neutral text-neutral-content overflow-hidden text-sm" data-testid="ticker">
      <div className="marquee py-2">
        {items.map((p, i) => {
          const dir = getChangeDir(p.change);
          const colorClass =
            dir === "up" ? "text-green-400" : dir === "down" ? "text-red-400" : "text-gray-400";
          return (
            <span key={i} className="mx-4 whitespace-nowrap inline-flex items-center gap-1.5">
              <span>{p.image || p.emoji}</span>
              <span className="font-medium">{p.nameBn || p.name}</span>
              <span>{fmtPrice(p.today ?? p.price)}/{p.unit}</span>
              <span className={`font-semibold ${colorClass}`}>{fmtPct(p.change)}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { categories } = useProducts();

  const logout = async () => {
    await authClient.signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
  };

  return (
    <header className="bg-base-100 shadow-sm sticky top-0 z-40 border-b border-base-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
          <Image src="/logo-icon.png" alt="বাজার দর লোগো" width={36} height={36} priority />
          <div className="leading-tight">
            <div className="font-bold text-lg text-primary tracking-tight">🛒 বাজার দর</div>
            <div className="text-xs text-base-content/60 font-medium">{banglaDate()}</div>
          </div>
        </Link>

        
        <nav className="hidden lg:flex items-center gap-1 flex-wrap justify-center">
          {categories.map((c) => {
            const isActive = path === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`btn btn-sm transition ${
                  isActive ? "btn-primary shadow-xs" : "btn-ghost hover:bg-base-200"
                }`}
              >
                <span>{c.icon}</span> <span>{c.nameBn || c.name}</span>
              </Link>
            );
          })}
        </nav>

        
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="skeleton h-8 w-24 rounded-md" />
          ) : session ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/profile"
                className="btn btn-sm sm:btn-md btn-ghost font-medium"
                title="প্রোফাইল দেখুন"
              >
                👤 {session.user.name || "ব্যবহারকারী"}
              </Link>
              <button onClick={logout} className="btn btn-sm sm:btn-md btn-outline btn-error">
                সাইন আউট
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/signin" className="btn btn-sm sm:btn-md btn-outline btn-primary">
                সাইন ইন
              </Link>
              <Link href="/signup" className="btn btn-sm sm:btn-md btn-primary">
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      
      <nav className="lg:hidden flex gap-1.5 overflow-x-auto px-4 pb-2.5 scrollbar-none border-t border-base-200 pt-2">
        {categories.map((c) => {
          const isActive = path === `/category/${c.slug}`;
          return (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`btn btn-xs whitespace-nowrap ${
                isActive ? "btn-primary" : "btn-ghost bg-base-200/60"
              }`}
            >
              <span>{c.icon}</span> <span>{c.nameBn || c.name}</span>
            </Link>
          );
        })}
      </nav>

      
      <Ticker />
    </header>
  );
}
