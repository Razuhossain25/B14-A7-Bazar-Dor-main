import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের নির্ভরযোগ্য বাজারদর ও তুলনা প্ল্যাটফর্ম।",
  icons: { icon: "/logo-icon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="bazar">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f0f5f1] text-[#202b23] antialiased">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
