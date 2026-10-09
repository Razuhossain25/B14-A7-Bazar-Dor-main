import Link from "next/link";
export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-24 text-center">
      <div className="text-7xl">🧺</div>
      <h1 className="text-3xl font-bold mt-4">৪০৪ — পৃষ্ঠাটি পাওয়া যায়নি</h1>
      <p className="mt-2 opacity-70">আপনি যে পৃষ্ঠাটি খুঁজছেন তা নেই বা সরানো হয়েছে।</p>
      <Link href="/" className="btn btn-primary mt-6">হোম পেজে ফিরে যান</Link>
    </div>
  );
}
