"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("প্রথমে সাইন ইন করুন");
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-4">
        <span className="loading loading-spinner loading-lg text-green-700" />
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-xs font-semibold text-red-600 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>↪</span> {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
          </button>
        </div>

        <div className="mt-7 flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-green-700 text-3xl font-bold text-white shadow-xs">
            {(session.user.name || session.user.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-[#202b23]">আমার প্রোফাইল</h1>
            <p className="mt-1 truncate text-sm text-gray-500 font-medium">
              অ্যাকাউন্টের তথ্য ও সেটিংস
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-green-50 p-5 space-y-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">নাম</p>
            <p className="mt-1 font-bold text-gray-900 text-base">
              {session.user.name || "ব্যবহারকারী"}
            </p>
          </div>

          <div className="pt-2 border-t border-green-100">
            <p className="text-xs text-gray-500 font-medium">ইমেইল ঠিকানা</p>
            <p className="mt-1 break-all font-semibold text-gray-900 text-sm">
              {session.user.email}
            </p>
            <p className="mt-1.5 text-xs text-gray-500">
              ইমেইল পরিবর্তনের সুবিধা এই ফর্মে নেই।
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/profile/update"
            className="btn w-full border-green-700 bg-green-700 text-white hover:bg-green-800 font-semibold rounded-xl text-sm shadow-xs flex items-center justify-center gap-2"
          >
            <span>✏️</span> তথ্য আপডেট করুন
          </Link>
        </div>
      </section>
    </main>
  );
}
