"use client";
import { use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import useProducts from "@/lib/useProducts";
import { fmtPrice, fmtPct, getChangeDir, toBn } from "@/lib/utils";

export default function Product({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { loading, categories, products } = useProducts();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("এই পৃষ্ঠা দেখতে সাইন ইন করুন");
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <div className="skeleton h-48 w-full rounded-2xl" />
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="skeleton h-28 rounded-2xl" />
          <div className="skeleton h-28 rounded-2xl" />
          <div className="skeleton h-28 rounded-2xl" />
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const p = products.find(
    (x) => String(x.slug) === String(slug) || String(x.id) === String(slug)
  );

  if (!p) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <div className="text-6xl mb-4">🧺</div>
        <h1 className="text-2xl font-bold text-base-content">৪০৪ — পণ্যটি পাওয়া যায়নি</h1>
        <p className="mt-2 text-base-content/70">
          আপনি যে পণ্যটি খুঁজছেন তা সিস্টেমে তালিকাভুক্ত নেই।
        </p>
        <Link href="/" className="btn btn-primary mt-6">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const markets = p.markets || [];
  let minPrice = p.today ?? p.price ?? 0;
  let maxPrice = p.today ?? p.price ?? 0;
  let avgPrice = p.today ?? p.price ?? 0;
  let lowestMarket = null;
  let highestMarket = null;

  if (markets.length > 0) {
    const mins = markets.map((m) => m.min ?? m.price ?? 0).filter((v) => v > 0);
    const maxs = markets.map((m) => m.max ?? m.price ?? 0).filter((v) => v > 0);
    const avgs = markets.map((m) => {
      if (m.min !== undefined && m.max !== undefined) return Math.round((m.min + m.max) / 2);
      return m.price ?? 0;
    }).filter((v) => v > 0);

    if (mins.length > 0) minPrice = Math.min(...mins);
    if (maxs.length > 0) maxPrice = Math.max(...maxs);
    if (avgs.length > 0) avgPrice = Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length);

    lowestMarket = [...markets].sort((a, b) => (a.min ?? a.price) - (b.min ?? b.price))[0];
    highestMarket = [...markets].sort((a, b) => (b.max ?? b.price) - (a.max ?? a.price))[0];
  }

  const cat = categories.find((c) => c.slug === p.category || c.id === p.category);
  const dir = getChangeDir(p.change);
  const badgeClass =
    dir === "up"
      ? "badge-success text-white"
      : dir === "down"
      ? "badge-error text-white"
      : "badge-ghost text-base-content/70";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      <div className="card bg-base-100 border border-base-300 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="text-6xl md:text-7xl p-3 bg-base-200 rounded-2xl flex items-center justify-center">
              {p.image || p.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-extrabold text-base-content">
                  {p.nameBn || p.name}
                </h1>
                <span className={`badge ${badgeClass} font-semibold`}>
                  {fmtPct(p.change)}
                </span>
              </div>
              <p className="opacity-75 mt-2 text-base md:text-lg">
                {p.desc || `${p.nameBn || p.name} — দেশের প্রধান বাজারগুলোর আজকের বিস্তারিত দর ও তুলনা।`}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {cat && (
                  <span className="badge badge-outline badge-primary font-medium py-3 px-3">
                    {cat.icon} {cat.nameBn || cat.name}
                  </span>
                )}
                <span className="badge badge-outline font-medium py-3 px-3">
                  প্রতি {p.unit}
                </span>
                <span className="badge badge-outline font-medium py-3 px-3">
                  আজকের গড় দাম: {fmtPrice(p.today ?? p.price)}
                </span>
              </div>
            </div>
          </div>
          <Link href="/" className="btn btn-outline btn-sm self-start md:self-center">
            ← তালিকায় ফিরুন
          </Link>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-base-100 border border-base-300 p-5 shadow-xs">
          <div className="text-sm text-base-content/60 font-medium">সর্বনিম্ন দাম</div>
          <div className="text-2xl md:text-3xl font-extrabold text-success mt-1">
            {fmtPrice(minPrice)}
          </div>
          {lowestMarket && (
            <div className="text-xs text-base-content/60 mt-1 line-clamp-1">
              সবচেয়ে কম দামের বাজার: <b>{lowestMarket.market || lowestMarket.name}</b>
            </div>
          )}
        </div>
        <div className="card bg-base-100 border border-base-300 p-5 shadow-xs">
          <div className="text-sm text-base-content/60 font-medium">গড় দাম</div>
          <div className="text-2xl md:text-3xl font-extrabold text-primary mt-1">
            {fmtPrice(avgPrice)}
          </div>
          <div className="text-xs text-base-content/60 mt-1">
            {markets.length > 0 ? `${toBn(markets.length)}টি বাজার অন্তর্ভুক্ত` : "বাজার বিশ্লেষণ"}
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300 p-5 shadow-xs">
          <div className="text-sm text-base-content/60 font-medium">সর্বোচ্চ দাম</div>
          <div className="text-2xl md:text-3xl font-extrabold text-error mt-1">
            {fmtPrice(maxPrice)}
          </div>
          {highestMarket && (
            <div className="text-xs text-base-content/60 mt-1 line-clamp-1">
              সবচেয়ে বেশি দামের বাজার: <b>{highestMarket.market || highestMarket.name}</b>
            </div>
          )}
        </div>
      </div>

      
      <div className="card bg-base-100 border border-base-300 p-6 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-xl text-base-content">বাজারভিত্তিক আজকের দাম</h2>
            <p className="text-xs text-base-content/60 mt-0.5">
              বিভিন্ন বাজারে প্রতি {p.unit} পণ্যের বর্তমান বিক্রয়মূল্য
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200 text-base-content text-sm">
                <th>বাজার</th>
                <th>বিভাগ</th>
                <th>সর্বনিম্ন দাম</th>
                <th>সর্বোচ্চ দাম</th>
                <th>গড় দাম</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m, idx) => {
                const marketName = m.market || m.name || `বাজার #${idx + 1}`;
                const division = m.division || "—";
                const min = m.min ?? m.price ?? 0;
                const max = m.max ?? m.price ?? 0;
                const avg = Math.round((min + max) / 2);

                return (
                  <tr key={idx} className="hover">
                    <td className="font-semibold text-base-content">{marketName}</td>
                    <td>
                      <span className="badge badge-sm badge-ghost">{division}</span>
                    </td>
                    <td className="text-success font-medium">{fmtPrice(min)}</td>
                    <td className="text-error font-medium">{fmtPrice(max)}</td>
                    <td className="font-bold text-primary">{fmtPrice(avg)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
