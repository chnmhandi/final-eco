import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import ToastContainer from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURA | Premium Modern E-Commerce",
  description: "Experience the ultimate collection of curated luxury lifestyle products, custom designer apparel, high-fidelity acoustics, and modern home design icon pieces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-accent/20 selection:text-accent">
        <ShopProvider>
          <Navbar />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
          <ToastContainer />
        </ShopProvider>
      </body>
    </html>
  );
}
