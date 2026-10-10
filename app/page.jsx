"use client";
import Image from "next/image";
import Link from "next/link";
import useProducts from "@/lib/useProducts";
import ProductCard, { CardSkeletons } from "@/components/ProductCard";
import { getChangePct, toBn } from "@/lib/utils";

export default function Home() {
  const { loading, categories, products } = useProducts();

  const risingProducts = [...products]
    .filter((p) => getChangePct(p.change) > 0)
    .sort((a, b) => getChangePct(b.change) - getChangePct(a.change))
    .slice(0, 6);

  const fallingProducts = [...products]
    .filter((p) => getChangePct(p.change) < 0)
    .sort((a, b) => getChangePct(a.change) - getChangePct(b.change))
    .slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-5 sm:py-6 space-y-7">
      {/* 1. Hero Banner */}
      <section className="overflow-hidden rounded-2xl border border-[#e1eae2] bg-[#fbfdfb]">
        <div className="grid items-center gap-3 px-5 py-5 sm:grid-cols-[1.45fr_0.75fr] sm:gap-5 sm:px-7 sm:py-6">
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-[#e0f2e6] px-3 py-1 text-xs font-semibold text-green-800">
              🌿 প্রতিদিনের বাজারদর
            </span>

            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-[#202b23] sm:whitespace-nowrap sm:text-3xl lg:text-[34px]">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার বাজারদর দেখুন। বিভিন্ন বাজারের দাম তুলনা করুন এবং জেনে নিন কোন পণ্যের দাম বাড়ছে বা কমছে।
            </p>

            <a
              href="#সব-পণ্য"
              className="mt-4 inline-flex items-center rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 cursor-pointer"
            >
              সব পণ্য দেখুন
              <span className="ml-2" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-[230px] sm:max-w-[250px]">
            <Image
              src="/bazar-hero.png"
              alt="বাজারের নিত্যপ্রয়োজনীয় পণ্য"
              width={600}
              height={450}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* 2. Rising prices (Section A: আজ দাম বেড়েছে) */}
      <section className="mt-7" aria-labelledby="rising-title">
        <div className="mb-3">
          <h2
            id="rising-title"
            className="text-lg font-extrabold text-[#202b23] sm:text-xl"
          >
            <span className="text-red-600">▲</span> আজ দাম বেড়েছে
          </h2>
        </div>

        {loading ? (
          <CardSkeletons n={6} />
        ) : risingProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {risingProducts.map((product) => (
              <ProductCard key={product.id || product.slug} p={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white p-4 text-sm text-gray-500">
            এই মুহূর্তে দাম বৃদ্ধির তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      {/* 3. Falling prices (Section B: আজ দাম কমেছে) */}
      <section className="mt-7" aria-labelledby="falling-title">
        <div className="mb-3">
          <h2
            id="falling-title"
            className="text-lg font-extrabold text-[#202b23] sm:text-xl"
          >
            <span className="text-green-700">▼</span> আজ দাম কমেছে
          </h2>
        </div>

        {loading ? (
          <CardSkeletons n={6} />
        ) : fallingProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fallingProducts.map((product) => (
              <ProductCard key={product.id || product.slug} p={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white p-4 text-sm text-gray-500">
            এই মুহূর্তে দাম কমার তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      {/* 4. All products (Section C: সব পণ্য) */}
      <section id="সব-পণ্য" className="mt-8 scroll-mt-28">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#202b23] sm:text-2xl">
              সব পণ্য
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              সব ক্যাটাগরির বাজারদর এক জায়গায়
            </p>
          </div>

          <span className="rounded-full bg-[#e0f2e6] px-3 py-1.5 text-xs font-semibold text-green-800 sm:text-sm">
            মোট {!loading ? toBn(products.length) : "..."}টি পণ্য
          </span>
        </div>

        {loading ? (
          <CardSkeletons n={9} />
        ) : (
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryProducts = products.filter(
                (product) =>
                  product.category === category.slug || product.category === category.id
              );

              if (categoryProducts.length === 0) return null;

              return (
                <section
                  key={category.slug || category.id}
                  id={`category-${category.slug}`}
                  className="scroll-mt-28"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-[#202b23] sm:text-lg">
                      {category.icon} {category.nameBn || category.name}
                      <span className="ml-1.5 text-xs font-normal text-gray-500 sm:text-sm">
                        ({toBn(categoryProducts.length)}টি)
                      </span>
                    </h3>

                    <Link
                      href={`/category/${category.slug}`}
                      className="shrink-0 text-xs font-semibold text-green-700 hover:underline sm:text-sm"
                    >
                      সব দেখুন →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryProducts.map((product) => (
                      <ProductCard
                        key={product.id || product.slug}
                        p={product}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
