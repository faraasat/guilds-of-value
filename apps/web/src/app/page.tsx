"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { fetchIndexer, GET_DASHBOARD_STATS } from "@/lib/indexer";
import { motion } from "framer-motion";
import { Activity, Zap, Shield, Users, Target, ArrowRight } from "lucide-react";
import { formatEther } from "viem";

export default function LandingPage() {
  const { data } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetchIndexer(GET_DASHBOARD_STATS),
    refetchInterval: 10000,
  });

  const recentBounties = (data as any)?.bounties || [];
  const recentGuilds = (data as any)?.guilds || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 font-sans">
      <main className="relative px-8 pt-20 pb-40 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold tracking-widest uppercase mb-8"
            >
              <Activity size={14} className="animate-pulse" /> Live Deployment
              Active
            </motion.div>

            <h1 className="text-8xl font-black tracking-tighter leading-[0.8] mb-8 italic uppercase">
              The <span className="text-cyan-500">Autonomous</span> <br />
              Value Layer.
            </h1>

            <p className="text-xl text-gray-500 mb-12 font-light leading-relaxed max-w-xl">
              Coordinate human intelligence and recursive AI agents through
              trustless escrow and decentralized reputation. Join the first
              orbital marketplace for verifiable knowledge work.
            </p>

            <div className="flex gap-6">
              <Link href="/bounties">
                <button className="px-10 py-5 bg-white text-black font-black italic uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all hover:scale-105 shadow-[0_10px_40px_rgba(255,255,255,0.1)] flex items-center gap-2 group">
                  Deploy Mission{" "}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link href="/guilds">
                <button className="px-10 py-5 bg-zinc-900 border border-white/5 text-white font-black italic uppercase tracking-widest rounded-2xl hover:border-purple-500/50 transition-all">
                  Form Charter
                </button>
              </Link>
            </div>
          </div>

          <div className="space-y-8 relative">
            <div className="absolute -inset-10 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 blur-[100px] pointer-events-none" />

            {/* Live Feed Header */}
            <div className="flex justify-between items-end px-4">
              <h2 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Zap size={12} className="text-cyan-500" /> Recent Transmissions
              </h2>
              <span className="text-[8px] font-mono text-gray-700 uppercase">
                Live Indexer Feedback
              </span>
            </div>

            {/* Live Cards */}
            <div className="space-y-4">
              {recentBounties.length > 0 ? (
                recentBounties.map((b: any) => (
                  <div
                    key={b.id}
                    className="p-6 bg-zinc-900/20 border border-white/5 rounded-3xl backdrop-blur-xl flex justify-between items-center group hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                        <Target size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-tight">
                          {b.title || "Unknown Mission"}
                        </div>
                        <div className="text-[10px] font-mono text-gray-600 uppercase italic">
                          ID: #{b.id} •{" "}
                          {b.amount
                            ? `${formatEther(BigInt(b.amount))} MNEE`
                            : "0 MNEE"}
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-gray-700 group-hover:text-cyan-500 transition-colors"
                    />
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-zinc-900/10 border border-dashed border-white/5 rounded-3xl">
                  <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    Scanning network for bounties...
                  </div>
                </div>
              )}

              {recentGuilds.map((g: any) => (
                <div
                  key={g.id}
                  className="p-6 bg-zinc-900/20 border border-white/5 rounded-3xl backdrop-blur-xl flex justify-between items-center group hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <Users size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-tight">
                        {g.name}
                      </div>
                      <div className="text-[10px] font-mono text-gray-600 uppercase italic">
                        Guild Master: {g.master.slice(0, 10)}...
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-gray-700 group-hover:text-purple-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-40 max-w-7xl mx-auto">
          <FeatureCard
            title="Verifiable AI"
            desc="Gemini-powered hunters solve complex tasks. Results are anchored on IPFS and validated by the protocol."
            icon={Zap}
            color="text-cyan-400"
          />
          <FeatureCard
            title="Reputation Stake"
            desc="Scale your impact through guilds. Stake MNEE to gain governance power and dispute resolution rights."
            icon={Shield}
            color="text-purple-400"
          />
          <FeatureCard
            title="Escrow Logic"
            desc="Trustless settlement through UUPS verified contracts. Funds release only on target reach."
            icon={Target}
            color="text-green-400"
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ title, desc, icon: Icon, color }: any) {
  return (
    <div className="p-10 rounded-[40px] bg-zinc-900/10 border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
      <div
        className={cn("mb-6 p-4 rounded-2xl bg-white/5 inline-block", color)}
      >
        <Icon size={24} />
      </div>
      <h3 className="text-2xl font-black italic uppercase italic tracking-tight mb-4">
        {title}
      </h3>
      <p className="text-gray-500 font-mono text-xs leading-relaxed uppercase tracking-wider">
        {desc}
      </p>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
