"use client";
import Image from "next/image";
import useProducts from "@/lib/useProducts";
import Section from "@/components/Section";
import { getChangePct } from "@/lib/utils";

export default function Home() {
  const { loading, products } = useProducts();

  const risers = [...products]
    .filter((p) => getChangePct(p.change) > 0)
    .sort((a, b) => getChangePct(b.change) - getChangePct(a.change))
    .slice(0, 6);

  const fallers = [...products]
    .filter((p) => getChangePct(p.change) < 0)
    .sort((a, b) => getChangePct(a.change) - getChangePct(b.change))
    .slice(0, 6);

  return (
    <div className="pb-16">
      
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            প্রতিদিনের বাজারদর
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-base-content">
            আজকের বাজারে কোন পণ্যের দাম কত?
          </h1>
          <p className="mt-4 text-base md:text-lg opacity-75 leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম দেখুন এক জায়গায়, বাজার ধরে তুলনা করুন।
          </p>
          <a
            href="#সব-পণ্য"
            className="btn btn-primary btn-md md:btn-lg mt-6 shadow-md hover:shadow-lg transition gap-2"
          >
            সব পণ্য দেখুন
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/bazar-hero.png"
            alt="বাজারের ঝুড়ি"
            width={480}
            height={400}
            priority
            className="w-full max-w-md h-auto object-contain drop-shadow-md hover:scale-105 transition duration-300"
          />
        </div>
      </section>

      
      <Section
        loading={loading}
        title="আজ দাম বেড়েছে ▲"
        subtitle="আজকের বাজারে সবচেয়ে বেশি দাম বৃদ্ধি পাওয়া ৬টি পণ্য"
        items={risers}
      />

      
      <Section
        loading={loading}
        title="আজ দাম কমেছে ▼"
        subtitle="আজকের বাজারে সবচেয়ে বেশি দাম হ্রাস পাওয়া ৬টি পণ্য"
        items={fallers}
      />

      
      <Section
        id="সব-পণ্য"
        loading={loading}
        title="সব পণ্য"
        subtitle="আজকের সব পণ্যের দাম ও পরিবর্তন"
        items={products}
      />
    </div>
  );
}
