import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import { cn } from "@/lib/utils";
import "@rainbow-me/rainbowkit/styles.css";

const font = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guilds of Value (GoV)",
  description:
    "Recursive Autonomous Economy protocol for human and AI collaboration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          font.className,
          "min-h-screen bg-black text-white antialiased selection:bg-cyan-500 selection:text-black",
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
