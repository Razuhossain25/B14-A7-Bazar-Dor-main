"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const router = useRouter();
  const { data: s, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !s) {
      toast.error("প্রথমে সাইন ইন করুন");
      router.replace("/signin");
    }
  }, [isPending, s, router]);

  if (isPending || !s) {
    return (
      <div className="max-w-md mx-auto p-6 my-12">
        <div className="skeleton h-56 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card bg-base-100 border border-base-300 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-14">
              <span className="text-2xl font-bold">
                {s.user.name ? s.user.name[0].toUpperCase() : "👤"}
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">আমার প্রোফাইল</h1>
            <p className="text-xs text-base-content/60">বাজার দর অ্যাকাউন্ট তথ্য</p>
          </div>
        </div>

        <div className="divide-y divide-base-200 pt-2">
          <div className="py-2.5 flex justify-between items-center text-sm">
            <span className="text-base-content/60 font-medium">নাম:</span>
            <span className="font-semibold text-base-content">{s.user.name}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center text-sm">
            <span className="text-base-content/60 font-medium">ইমেইল:</span>
            <span className="font-semibold text-base-content">{s.user.email}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-2">
          <Link href="/profile/update" className="btn btn-primary w-full">
            ✏️ তথ্য আপডেট করুন
          </Link>
          <Link href="/" className="btn btn-ghost btn-sm w-full">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
