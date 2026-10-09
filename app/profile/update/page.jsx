"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfile() {
  const router = useRouter();
  const { data: s, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (s?.user?.name) setName(s.user.name);
    if (!isPending && !s) router.replace("/signin");
  }, [s, isPending, router]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("নাম খালি রাখা যাবে না");
    setBusy(true);
    try {
      const { error } = await authClient.updateUser({ name });
      setBusy(false);
      if (error) return toast.error(error.message || "আপডেট ব্যর্থ হয়েছে");
      toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে");
      router.push("/profile");
    } catch (err) {
      setBusy(false);
      toast.error(err.message || "সার্ভার এরর, আবার চেষ্টা করুন");
    }
  };

  if (isPending || !s) {
    return (
      <div className="max-w-md mx-auto p-6 my-12">
        <div className="skeleton h-56 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card bg-base-100 border border-base-300 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-base-content mb-1">তথ্য আপডেট</h1>
        <p className="text-sm text-base-content/60 mb-6">
          আপনার অ্যাকাউন্টের নাম পরিবর্তন করতে নিচের ফরমটি পূরণ করুন।
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div className="form-control">
            <label className="label text-xs font-medium text-base-content/70">নাম</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="আপনার নতুন নাম লিখুন"
              className="input input-bordered w-full focus:outline-primary"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="btn btn-primary w-full mt-2 font-medium"
          >
            {busy ? <span className="loading loading-spinner" /> : "তথ্য আপডেট করুন"}
          </button>

          <Link href="/profile" className="btn btn-ghost btn-sm w-full">
            বাতিল করুন
          </Link>
        </form>
      </div>
    </div>
  );
}
