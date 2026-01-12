"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, LayoutDashboard } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function PublicHeader() {
  const { isConnected } = useAccount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:border-cyan-500/50 transition-all">
            <Shield size={24} className="text-cyan-400" />
          </div>
          <span className="text-xl font-black italic uppercase tracking-tighter">
            MNEE
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-12">
          {["About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-[10px] font-mono font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          {isConnected && (
            <Link href="/dashboard">
              <button className="px-6 py-2.5 bg-zinc-900 border border-white/5 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full hover:border-cyan-500/50 transition-all flex items-center gap-2 text-cyan-400">
                <LayoutDashboard size={14} /> Dashboard
              </button>
            </Link>
          )}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
