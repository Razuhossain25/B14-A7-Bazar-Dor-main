"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthForm({ mode }) {
  const signup = mode === "signup";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [socialLoading, setSocialLoading] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (signup && !name.trim()) {
      const msg = "অনুগ্রহ করে আপনার নাম লিখুন।";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      const msg = "সঠিক ইমেইল ঠিকানা দিন।";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (!password || password.length < 8) {
      const msg = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      if (signup) {
        const result = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        if (result?.error) {
          const raw = result.error.message || "";
          const msg = raw.includes("exists")
            ? "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে।"
            : raw || "রেজিস্ট্রেশন করা যায়নি।";
          setFormError(msg);
          toast.error(msg);
          return;
        }

        toast.success("রেজিস্ট্রেশন সফল হয়েছে! এবার সাইন ইন করুন।");
        router.push("/signin");
      } else {
        const result = await authClient.signIn.email({
          email: email.trim(),
          password,
        });

        if (result?.error) {
          const raw = result.error.message || "";
          const msg =
            raw.includes("Invalid") || raw.includes("credentials")
              ? "ভুল ইমেইল বা পাসওয়ার্ড।"
              : raw || "ভুল ইমেইল বা পাসওয়ার্ড।";
          setFormError(msg);
          toast.error(msg);
          return;
        }

        toast.success("সফলভাবে সাইন ইন হয়েছে!");
        router.push("/");
        router.refresh();
      }
    } catch {
      const msg = "সার্ভার এরর, অনুগ্রহ করে আবার চেষ্টা করুন।";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    setSocialLoading(provider);
    setFormError("");
    try {
      const callbackURL =
        typeof window !== "undefined" ? `${window.location.origin}/` : "/";
      const result = await authClient.signIn.social({
        provider,
        callbackURL,
      });

      if (result?.error) {
        const provName = provider === "google" ? "Google" : "GitHub";
        const msg = `${provName} দিয়ে সাইন ইন সম্ভব হচ্ছে না।`;
        setFormError(msg);
        toast.error(msg);
        setSocialLoading(null);
      }
    } catch {
      const provName = provider === "google" ? "Google" : "GitHub";
      const msg = `${provName} লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।`;
      setFormError(msg);
      toast.error(msg);
      setSocialLoading(null);
    }
  };

  const disabled = loading || socialLoading !== null;

  return (
    <main className="flex min-h-[85vh] items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-6 sm:p-10 shadow-sm">
        <Link
          href="/"
          className="text-sm font-medium text-green-700 hover:underline flex items-center gap-1 mb-6"
        >
          ← হোম পেজে ফিরে যান
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#202b23]">
            {signup ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {signup
              ? "বিনা খরচে সাইন আপ করে বাজার দরের সব তথ্য দেখুন।"
              : "আপনার অ্যাকাউন্টে প্রবেশ করে বিস্তারিত বাজার দর দেখুন।"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm font-medium text-red-700">
              ⚠️ {formError}
            </div>
          )}
          {signup && (
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-[#202b23]"
              >
                আপনার নাম
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: রহিম উদ্দিন"
                className="w-full rounded-lg border border-[#dce6de] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-[#202b23]"
            >
              ইমেইল
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[#dce6de] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-[#202b23]"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full rounded-lg border border-[#dce6de] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <button
            type="submit"
            disabled={disabled}
            className="btn w-full border-green-700 bg-green-700 text-white hover:bg-green-800 font-semibold rounded-xl text-sm transition mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : signup ? (
              "রেজিস্টার করুন"
            ) : (
              "সাইন ইন"
            )}
          </button>
        </form>

        <div className="relative my-6 flex items-center">
          <div className="flex-grow border-t border-[#dce6de]" />
          <span className="mx-3 text-xs text-gray-500 font-medium">অথবা</span>
          <div className="flex-grow border-t border-[#dce6de]" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleSocialSignIn("google")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce6de] bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
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
            {socialLoading === "google"
              ? "সংযোগ হচ্ছে..."
              : "Google দিয়ে চালিয়ে যান"}
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => handleSocialSignIn("github")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce6de] bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 cursor-pointer"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {socialLoading === "github"
              ? "সংযোগ হচ্ছে..."
              : "GitHub দিয়ে চালিয়ে যান"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 font-medium">
          {signup ? (
            <>
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link
                href="/signin"
                className="font-bold text-green-700 hover:underline"
              >
                সাইন ইন করুন
              </Link>
            </>
          ) : (
            <>
              অ্যাকাউন্ট নেই?{" "}
              <Link
                href="/signup"
                className="font-bold text-green-700 hover:underline"
              >
                সাইন আপ করুন
              </Link>
            </>
          )}
        </p>
      </section>
    </main>
  );
}
