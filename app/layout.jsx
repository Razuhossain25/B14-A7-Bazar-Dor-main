import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export const metadata = { title: "বাজার দর", description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।", icons: { icon: "/logo-icon.png" } };
export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="bazar">
      <head><link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet" /></head>
      <body className="min-h-screen flex flex-col bg-base-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
