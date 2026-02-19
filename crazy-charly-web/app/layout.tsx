import type { Metadata } from "next";
import { Open_Sans, Besley } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const besley = Besley({
  variable: "--font-besley",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Toys Academy - Back-Office",
  description: "Back-office mobile de gestion des Toy Box",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light">
      <body
        className={`${openSans.variable} ${besley.variable} antialiased bg-[#fffcf5] text-[#131445] min-h-screen relative`}
      >
        {/* LIGHT SPHERES FOR GLASSMORPHISM DEPTH */}
        <div className="fixed top-[-10%] left-[-20%] w-[80%] h-[40%] bg-[#4c40cf]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="fixed bottom-[10%] right-[-30%] w-[90%] h-[50%] bg-[#4c40cf]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="fixed top-[40%] left-[10%] w-[30%] h-[20%] bg-[#4c40cf]/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

        {children}
      </body>
    </html>
  );
}
