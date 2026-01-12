"use client";

import { Shell } from "@/components/shell";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { Shield, Zap, Target } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold tracking-widest uppercase">
            <Shield size={14} /> Access Restricted
          </div>

          <h2 className="text-5xl font-black tracking-tighter italic uppercase leading-[0.8]">
            Wallet <span className="text-cyan-500">Handshake</span> Required.
          </h2>

          <p className="text-zinc-400 font-mono text-xs leading-relaxed uppercase tracking-wider">
            This sector of the Autonomous Economy is protected by orbital
            encryption. Establish a neural link with your wallet to access
            missions, guilds, and governance.
          </p>

          <div className="flex flex-col items-center gap-6 pt-4">
            <ConnectButton />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-12 opacity-50">
            <div className="flex flex-col items-center gap-2">
              <Target size={16} className="text-cyan-500" />
              <span className="text-[8px] font-mono uppercase tracking-widest">
                Missions
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap size={16} className="text-purple-500" />
              <span className="text-[8px] font-mono uppercase tracking-widest">
                Agent Link
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield size={16} className="text-green-500" />
              <span className="text-[8px] font-mono uppercase tracking-widest">
                Protocol
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return <Shell>{children}</Shell>;
}
