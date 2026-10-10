import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#dce6de] bg-[#fbfdfb]">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-5 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <Link
          href="/"
          className="font-semibold text-[#202b23] hover:text-green-700 transition"
        >
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </Link>

        <p className="text-gray-500">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
