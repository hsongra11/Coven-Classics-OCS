import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../../styles/global.css";
import Providers from "./_Provider/Providers";
import Navbar from "./_component/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coven Classics",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="bg-[#181818] min-h-screen font-[Carola]">
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
