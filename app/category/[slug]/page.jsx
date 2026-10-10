"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useProducts from "@/lib/useProducts";
import ProductCard, { CardSkeletons } from "@/components/ProductCard";
import { fromBn, toBn } from "@/lib/utils";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug;
  const { loading, categories, products } = useProducts();
  const [sort, setSort] = useState("default");

  const category = categories.find((c) => c.slug === slug || c.id === slug);
  const categoryProducts = products.filter(
    (p) => p.category === slug || (category && p.category === category.slug)
  );

  const sortedProducts = useMemo(() => {
    const list = [...categoryProducts];
    const getNumericPrice = (p) => {
      const val = p.today ?? p.price ?? 0;
      return typeof val === "number" ? val : fromBn(val);
    };

    if (sort === "low-high" || sort === "asc") {
      list.sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
    } else if (sort === "high-low" || sort === "desc") {
      list.sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
    }
    return list;
  }, [categoryProducts, sort]);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 space-y-6">
        <div className="skeleton h-5 w-24 rounded-lg" />
        <div className="skeleton h-32 w-full rounded-2xl bg-white" />
        <div className="skeleton h-8 w-48 rounded-lg mt-8" />
        <CardSkeletons n={6} />
      </main>
    );
  }

  if (!category || categoryProducts.length === 0) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-green-100 bg-white p-10 max-w-md mx-auto shadow-sm">
          <p className="text-5xl mb-4">🔎</p>
          <h1 className="text-2xl font-bold text-[#202b23]">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            অন্য ক্যাটাগরি নির্বাচন করে আবার চেষ্টা করুন।
          </p>
          <Link
            href="/"
            className="btn mt-6 bg-green-700 hover:bg-green-800 text-white border-none"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <Link href="/" className="text-sm font-medium text-green-700 hover:underline">
        ← হোম পেজ
      </Link>

      {/* Header Banner */}
      <section className="mt-6 rounded-2xl border border-green-100 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-4">
          <span className="text-5xl block">{category.icon}</span>
          <div>
            <p className="text-sm font-semibold text-green-700">পণ্য ক্যাটাগরি</p>
            <h1 className="text-3xl font-extrabold text-[#202b23]">
              {category.nameBn || category.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              মোট {toBn(categoryProducts.length)}টি পণ্য
            </p>
          </div>
        </div>
      </section>

      {/* Products & Sort Section */}
      <section className="mt-8">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold text-[#202b23]">এই ক্যাটাগরির সব পণ্য</h2>

          <label className="flex items-center gap-3 text-sm">
            <span className="whitespace-nowrap font-medium text-[#202b23]">সাজান:</span>

            <select
              className="select select-bordered select-sm sm:select-md w-full max-w-xs bg-white text-sm font-medium text-[#202b23]"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">ডিফল্ট</option>
              <option value="low-high">দাম: কম থেকে বেশি</option>
              <option value="high-low">দাম: বেশি থেকে কম</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id || product.slug} p={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
