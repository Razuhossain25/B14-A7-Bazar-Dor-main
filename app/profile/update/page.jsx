"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user.name) {
      setName(session.user.name);
    }
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [session, isPending, router]);

  async function handleUpdate(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      toast.error("নাম অন্তত ২ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result?.error) {
        toast.error(result.error.message || "প্রোফাইল আপডেট করা যায়নি।");
        return;
      }

      toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-4">
        <span className="loading loading-spinner loading-lg text-green-700" />
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:p-10">
        <Link
          href="/profile"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← প্রোফাইলে ফিরে যান
        </Link>

        <div className="mt-7">
          <h1 className="text-2xl font-extrabold text-[#202b23]">তথ্য আপডেট করুন</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            আপনার অ্যাকাউন্টের নাম পরিবর্তন করতে নিচের ফরমটি পূরণ করুন।
          </p>
        </div>

        <form onSubmit={handleUpdate} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-[#202b23]"
            >
              আপনার নাম
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#dce6de] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="আপনার নতুন নাম লিখুন"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full border-green-700 bg-green-700 text-white hover:bg-green-800 font-semibold rounded-xl text-sm shadow-xs"
          >
            {loading ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
          </button>

          <Link
            href="/profile"
            className="btn btn-ghost w-full rounded-xl text-sm font-medium text-gray-600"
          >
            বাতিল করুন
          </Link>
        </form>
      </section>
    </main>
  );
}
