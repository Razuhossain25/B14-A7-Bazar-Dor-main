import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="rounded-3xl border border-green-100 bg-white p-10 max-w-md mx-auto shadow-sm">
        <p className="text-6xl mb-4">🧺</p>
        <h1 className="text-2xl font-extrabold text-[#202b23]">
          ৪০৪ — পৃষ্ঠাটি পাওয়া যায়নি
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          আপনি যে পৃষ্ঠাটি খুঁজছেন তা নেই বা সরানো হয়েছে।
        </p>
        <Link
          href="/"
          className="btn mt-6 bg-green-700 hover:bg-green-800 text-white border-none rounded-xl font-semibold shadow-xs"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
