"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import useProducts from "@/lib/useProducts";
import { banglaDate, fmtPct, getChangeDir, toBn } from "@/lib/utils";

function Ticker() {
  const { products } = useProducts();
  if (!products.length) return <div className="h-9 border-b border-[#e3ebe4] bg-[#f8faf8]" />;
  const items = [...products, ...products];

  return (
    <div
      className="overflow-hidden border-b border-[#e3ebe4] bg-[#f8faf8] py-2 text-xs sm:text-sm"
      data-testid="ticker"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {items.map((p, i) => {
          const dir = getChangeDir(p.change);
          const priceStr = toBn(p.today ?? p.price ?? 0);
          return (
            <Link
              key={i}
              href={`/product/${p.slug}`}
              className="mx-4 flex items-center gap-1.5 border-r border-[#e4eae5] pr-4 text-gray-700 transition hover:text-green-800 shrink-0"
            >
              <span>{p.image || p.emoji}</span>
              <span className="font-medium text-[#202b23]">{p.nameBn || p.name}</span>
              <span>৳{priceStr}/{p.unit}</span>
              {dir === "up" ? (
                <span className="font-semibold text-red-600">{fmtPct(p.change)}</span>
              ) : dir === "down" ? (
                <span className="font-semibold text-green-700">{fmtPct(p.change)}</span>
              ) : (
                <span className="text-gray-500 font-medium">{fmtPct(p.change)}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { categories } = useProducts();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const result = await authClient.signOut();
      if (result?.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি।");
        return;
      }
      toast.success("সফলভাবে সাইন আউট হয়েছে!");
      setMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <>
      {/* 1. Main Header */}
      <header className="border-b border-[#e6ece7] bg-white">
        <div className="mx-auto flex min-h-[68px] max-w-5xl items-center justify-between gap-3 px-4 py-2">
          {/* Logo on Left */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#07883f] p-2 text-white shadow-xs">
              <span className="text-xl">🛒</span>
            </div>
            <span>
              <span className="block text-lg font-extrabold leading-tight text-[#202b23]">
                বাজার দর
              </span>
              <span className="mt-0.5 block text-[11px] leading-tight text-gray-500 font-medium">
                {banglaDate()}
              </span>
            </span>
          </Link>

          {/* Right Subtitle & Auth controls */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-bold leading-tight text-green-800">
                বাংলাদেশের বাজারদর
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                প্রয়োজনীয় পণ্যের দাম এক নজরে
              </p>
            </div>

            {isPending ? (
              <div className="skeleton h-9 w-20 rounded-xl" />
            ) : session ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  aria-label="User menu"
                  className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-2.5 py-1.5 transition hover:bg-green-100 sm:px-3 cursor-pointer"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white shadow-xs">
                    {(session.user.name || session.user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                  <span className="hidden max-w-28 truncate text-sm font-semibold sm:block text-[#202b23]">
                    {session.user.name || session.user.email}
                  </span>
                  <span aria-hidden="true" className="text-xs text-gray-500">
                    ⌄
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-[#dce6de] bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                    <div className="border-b border-gray-100 px-3 py-3">
                      <p className="truncate font-semibold text-gray-900 text-sm">
                        {session.user.name || "ব্যবহারকারী"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {session.user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className={`mt-2 block rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-green-50 ${
                        pathname === "/profile"
                          ? "bg-green-50 text-green-800 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      👤 আমার প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>↪</span> {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/signin"
                  className="rounded-lg px-2.5 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-50 sm:px-3"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-green-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800 shadow-xs"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Category Navigation Bar (Second Row) */}
      <nav className="sticky top-0 z-20 border-b border-[#e6ece7] bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-1.5 scrollbar-none">
          <Link
            href="/"
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition ${
              pathname === "/"
                ? "bg-green-700 font-semibold text-white shadow-xs"
                : "text-gray-700 hover:bg-green-50 hover:text-green-800"
            }`}
          >
            🏠 হোম
          </Link>

          {categories.map((category) => {
            const active = pathname === `/category/${category.slug}`;
            return (
              <Link
                key={category.slug || category.id}
                href={`/category/${category.slug}`}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition flex items-center gap-1 ${
                  active
                    ? "bg-green-700 font-semibold text-white shadow-xs"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-800"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.nameBn || category.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 3. Ticker Bar */}
      <Ticker />
    </>
  );
}
