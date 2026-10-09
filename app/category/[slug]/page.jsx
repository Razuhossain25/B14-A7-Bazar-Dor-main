"use client";
import { use, useState } from "react";
import Link from "next/link";
import useProducts from "@/lib/useProducts";
import ProductCard, { CardSkeletons } from "@/components/ProductCard";
import { fromBn } from "@/lib/utils";

export default function Category({ params }) {
  const { slug } = use(params);
  const { loading, categories, products } = useProducts();
  const [sort, setSort] = useState("default");

  const cat = categories.find((c) => c.slug === slug || c.id === slug);
  let items = products.filter((p) => p.category === slug || (cat && p.category === cat.slug));

  const getNumericPrice = (p) => {
    const val = p.today ?? p.price ?? 0;
    return typeof val === "number" ? val : fromBn(val);
  };

  if (sort === "asc") {
    items = [...items].sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
  } else if (sort === "desc") {
    items = [...items].sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {loading ? (
        <div className="space-y-6">
          <div className="skeleton h-10 w-48" />
          <CardSkeletons n={8} />
        </div>
      ) : !cat || !items.length ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl border border-base-300 p-8 max-w-xl mx-auto shadow-xs">
          <div className="text-6xl mb-4">🧺</div>
          <h1 className="text-2xl font-bold text-base-content">
            ৪০৪ — এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
          </h1>
          <p className="mt-2 text-base-content/70">
            সম্ভবত ক্যাটাগরিটি পরিবর্তিত হয়েছে বা বিদ্যমান নেই।
          </p>
          <Link href="/" className="btn btn-primary mt-6">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-base-300">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <h1 className="text-3xl font-bold text-base-content">
                  {cat.nameBn || cat.name}
                </h1>
              </div>
              <p className="text-sm text-base-content/60 mt-1">
                মোট {items.length}টি পণ্যের আজকের বাজারদর
              </p>
            </div>

            
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label htmlFor="sort-dropdown" className="text-sm font-medium text-base-content/80 whitespace-nowrap">
                সাজান:
              </label>
              <div className="relative inline-block">
                <select
                  id="sort-dropdown"
                  className="select select-bordered select-sm sm:select-md pr-10 font-medium focus:outline-primary bg-base-100"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="asc">দাম: কম থেকে বেশি</option>
                  <option value="desc">দাম: বেশি থেকে কম</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-base-content/60">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <ProductCard key={p.slug || p.id} p={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
