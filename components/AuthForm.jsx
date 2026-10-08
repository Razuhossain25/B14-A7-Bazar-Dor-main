"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthForm({ mode }) {
  const signup = mode === "signup";
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = f.get("email");
    const password = f.get("password");
    const name = f.get("name");

    if (!password || password.length < 8) {
      return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    }

    setBusy(true);
    try {
      if (signup) {
        const { error } = await authClient.signUp.email({ name, email, password });
        setBusy(false);
        if (error) {
          return toast.error(error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
        }
        await authClient.signOut();
        toast.success("রেজিস্ট্রেশন সফল হয়েছে! এবার সাইন ইন করুন");
        router.push("/signin");
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        setBusy(false);
        if (error) {
          return toast.error(error.message || "ভুল ইমেইল বা পাসওয়ার্ড");
        }
        toast.success("সফলভাবে সাইন ইন হয়েছে");
        router.push("/");
      }
    } catch (err) {
      setBusy(false);
      toast.error(err.message || "সার্ভার এরর, অনুগ্রহ করে আবার চেষ্টা করুন");
    }
  };

  const social = async (provider) => {
    try {
      await authClient.signIn.social({ provider, callbackURL: "/" });
    } catch {
      toast.error(`${provider} দিয়ে সাইন ইন সম্ভব হচ্ছে না`);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card bg-base-100 border border-base-300 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center text-base-content">
          {signup ? "নতুন অ্যাকাউন্ট খুলুন" : "সাইন ইন করুন"}
        </h1>
        <p className="text-sm text-center text-base-content/60 mt-1 mb-6">
          {signup
            ? "বাজার দরের সকল সুবিধা উপভোগ করতে নিবন্ধন করুন"
            : "আপনার অ্যাকাউন্টে লগইন করে বিস্তারিত দর দেখুন"}
        </p>

        <form onSubmit={submit} className="space-y-4">
          {signup && (
            <div className="form-control">
              <label className="label text-xs font-medium text-base-content/70">আপনার নাম</label>
              <input
                name="name"
                required
                placeholder="যেমন: রহিম উদ্দিন"
                className="input input-bordered w-full focus:outline-primary"
              />
            </div>
          )}

          <div className="form-control">
            <label className="label text-xs font-medium text-base-content/70">ইমেইল ঠিকানা</label>
            <input
              name="email"
              type="email"
              required
              placeholder="example@mail.com"
              className="input input-bordered w-full focus:outline-primary"
            />
          </div>

          <div className="form-control">
            <label className="label text-xs font-medium text-base-content/70">পাসওয়ার্ড</label>
            <input
              name="password"
              type="password"
              required
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="input input-bordered w-full focus:outline-primary"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="btn btn-primary w-full mt-2 font-medium"
          >
            {busy ? (
              <span className="loading loading-spinner" />
            ) : signup ? (
              "রেজিস্টার করুন"
            ) : (
              "লগইন করুন"
            )}
          </button>
        </form>

        <div className="divider text-xs text-base-content/50 my-6">অথবা</div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => social("google")}
            className="btn btn-outline w-full flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 20.4 7.5 23 12 23z"
              />
            </svg>
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            type="button"
            onClick={() => social("github")}
            className="btn btn-outline w-full flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="text-sm text-center text-base-content/70 mt-6">
          {signup ? (
            <>
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link href="/signin" className="link link-primary font-semibold">
                সাইন ইন করুন
              </Link>
            </>
          ) : (
            <>
              অ্যাকাউন্ট নেই?{" "}
              <Link href="/signup" className="link link-primary font-semibold">
                সাইন আপ করুন
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
