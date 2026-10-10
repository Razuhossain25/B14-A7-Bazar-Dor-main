"use client";
import { use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import useProducts from "@/lib/useProducts";
import { fmtPct, getChangeDir, toBn } from "@/lib/utils";

export default function ProductDetailsPage({ params }) {
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
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:py-12 space-y-6">
        <div className="skeleton h-6 w-36 rounded-lg" />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] mt-6">
          <div className="skeleton h-80 rounded-3xl" />
          <div className="skeleton h-80 rounded-3xl" />
        </div>
        <div className="skeleton h-56 rounded-3xl mt-8" />
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const product = products.find(
    (x) => String(x.slug) === String(slug) || String(x.id) === String(slug)
  );

  if (!product) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-green-100 bg-white p-10 max-w-md mx-auto shadow-sm">
          <p className="text-6xl mb-4">🧺</p>
          <h1 className="text-2xl font-bold text-[#202b23]">৪০৪ — পণ্যটি পাওয়া যায়নি</h1>
          <p className="mt-2 text-gray-500 text-sm">
            আপনি যে পণ্যটি খুঁজছেন তা সিস্টেমে তালিকাভুক্ত নেই।
          </p>
          <Link
            href="/"
            className="btn mt-6 bg-green-700 hover:bg-green-800 text-white border-none"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const markets = product.markets || [];
  let minPrice = product.today ?? product.price ?? 0;
  let maxPrice = product.today ?? product.price ?? 0;
  let averagePrice = product.today ?? product.price ?? 0;

  if (markets.length > 0) {
    const mins = markets.map((m) => m.min ?? m.price ?? 0).filter((v) => v > 0);
    const maxs = markets.map((m) => m.max ?? m.price ?? 0).filter((v) => v > 0);
    const avgs = markets
      .map((m) => {
        if (m.min !== undefined && m.max !== undefined) return (m.min + m.max) / 2;
        return m.price ?? 0;
      })
      .filter((v) => v > 0);

    if (mins.length > 0) minPrice = Math.min(...mins);
    if (maxs.length > 0) maxPrice = Math.max(...maxs);
    if (avgs.length > 0) averagePrice = Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length);
  }

  const cat = categories.find(
    (c) => c.slug === product.category || c.id === product.category
  );

  const dir = getChangeDir(product.change);
  const badgeClass =
    dir === "up"
      ? "bg-red-50 text-red-600"
      : dir === "down"
      ? "bg-green-50 text-green-700"
      : "bg-gray-100 text-gray-600";

  const historicalPrices = [
    { label: "গতকাল", price: product.yesterday ?? product.today },
    { label: "গত সপ্তাহ", price: product.lastWeek ?? product.today },
    { label: "গত মাস", price: product.lastMonth ?? product.today },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="text-sm font-medium text-green-700 hover:underline flex items-center gap-1.5"
      >
        ← হোম পেজে ফিরে যান
      </Link>

      {/* Top 2-Column Overview Section */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Hero Card */}
        <div className="flex min-h-72 items-center justify-center rounded-3xl border border-green-100 bg-white p-8 shadow-xs">
          <div className="text-center">
            <span className="text-8xl block transform hover:scale-105 transition-transform duration-200">
              {product.image || product.emoji}
            </span>

            <p className="mt-5 text-sm font-medium text-gray-500">
              {cat?.icon} {cat?.nameBn || cat?.name || "সাধারণ"}
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#202b23]">
              {product.nameBn || product.name}
            </h1>

            <p className="mt-2 text-sm text-gray-500 font-medium">
              প্রতি {product.unit}
            </p>
          </div>
        </div>

        {/* Right Details & Stats Card */}
        <div className="rounded-3xl border border-green-100 bg-white p-6 sm:p-8 shadow-xs">
          <p className="text-sm font-semibold text-green-700">
            আজকের বাজারদর
          </p>

          <div className="mt-3 flex flex-wrap items-end gap-3">
            <h2 className="text-4xl font-extrabold text-green-800">
              ৳{toBn(product.today ?? product.price)}
            </h2>

            <span
              className={`mb-1 rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}
            >
              {fmtPct(product.change)}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500 font-medium">
            প্রতি {product.unit} হিসাবে
          </p>

          {/* 4 Quick Stat Cards */}
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-sm text-gray-600 font-medium">
                সর্বনিম্ন বাজারদর
              </p>
              <p className="mt-1 text-xl font-extrabold text-green-800">
                ৳{toBn(minPrice)}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-sm text-gray-600 font-medium">
                সর্বোচ্চ বাজারদর
              </p>
              <p className="mt-1 text-xl font-extrabold text-green-800">
                ৳{toBn(maxPrice)}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm text-gray-600 font-medium">
                গড় বাজারদর
              </p>
              <p className="mt-1 text-xl font-extrabold text-blue-900">
                ৳{toBn(averagePrice)}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-sm text-gray-600 font-medium">
                গতকালের দাম
              </p>
              <p className="mt-1 text-xl font-extrabold text-amber-900">
                ৳{toBn(product.yesterday ?? product.today)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Price Comparison */}
      <section className="mt-8 rounded-3xl border border-green-100 bg-white p-5 sm:p-8 shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold text-[#202b23]">দামের তুলনা</h2>
          <p className="mt-1.5 text-sm text-gray-500 font-medium">
            বিভিন্ন সময়ের বাজারদরের তুলনা
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {historicalPrices.map((item) => {
            const difference = (product.today ?? product.price) - item.price;
            const percentage =
              item.price > 0 ? (difference / item.price) * 100 : 0;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-100 bg-[#fafcfa] p-5 shadow-xs"
              >
                <p className="text-sm text-gray-500 font-medium">
                  {item.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-[#202b23]">
                  ৳{toBn(item.price)}
                </p>

                <p
                  className={`mt-2 text-sm font-semibold ${
                    difference > 0
                      ? "text-red-600"
                      : difference < 0
                      ? "text-green-700"
                      : "text-gray-500"
                  }`}
                >
                  {difference > 0
                    ? `▲ ${toBn(Math.abs(percentage).toFixed(1))}% বৃদ্ধি`
                    : difference < 0
                    ? `▼ ${toBn(Math.abs(percentage).toFixed(1))}% হ্রাস`
                    : "— পরিবর্তন নেই"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Market-specific prices */}
      <section className="mt-8 rounded-3xl border border-green-100 bg-white p-5 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-[#202b23]">বাজারভিত্তিক দাম</h2>
            <p className="mt-1.5 text-sm text-gray-500 font-medium">
              বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ দাম
            </p>
          </div>

          <span className="rounded-full bg-green-50 px-3.5 py-1 text-sm font-semibold text-green-800">
            {toBn(markets.length)}টি বাজার
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr className="bg-[#f0f5f1] text-[#202b23] font-bold">
                <th className="py-3 px-4">বাজারের নাম</th>
                <th className="py-3 px-4">বিভাগ</th>
                <th className="py-3 px-4">সর্বনিম্ন দাম</th>
                <th className="py-3 px-4">সর্বোচ্চ দাম</th>
                <th className="py-3 px-4">গড় দাম</th>
              </tr>
            </thead>

            <tbody>
              {markets.map((market, index) => {
                const min = market.min ?? market.price ?? 0;
                const max = market.max ?? market.price ?? 0;
                const avg = Math.round((min + max) / 2);
                return (
                  <tr key={`${market.market}-${index}`} className="hover">
                    <td className="py-3 px-4 font-semibold text-[#202b23]">
                      {market.market || market.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge badge-sm badge-ghost font-medium">
                        {market.division || "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-800">
                      ৳{toBn(min)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-red-600">
                      ৳{toBn(max)}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#07883f]">
                      ৳{toBn(avg)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Category Back Link */}
      {cat && (
        <div className="mt-8 text-center">
          <Link
            href={`/category/${cat.slug}`}
            className="btn bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl border-none shadow-sm"
          >
            {cat.nameBn || cat.name} ক্যাটাগরির সব পণ্য দেখুন →
          </Link>
        </div>
      )}
    </main>
  );
}
