"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchIndexer, GET_DASHBOARD_STATS } from "@/lib/indexer";
import { motion } from "framer-motion";
import { Activity, Zap, Users, Target, ArrowRight, Shield } from "lucide-react";
import { formatEther } from "viem";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetchIndexer(GET_DASHBOARD_STATS),
    refetchInterval: 10000,
  });

  const recentBounties = (data as any)?.bounties || [];
  const recentGuilds = (data as any)?.guilds || [];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">
            Mission Dashboard
          </h1>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
            Orbital Sector 7 • Real-time Protocol Synchronization
          </p>
        </div>
        <div className="flex gap-4">
          <FaucetButton />
          <Link href="/bounties">
            <button className="px-6 py-3 bg-white text-black font-black italic uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all text-[10px] flex items-center gap-2">
              Deploy Mission <Target size={14} />
            </button>
          </Link>
          <Link href="/guilds">
            <button className="px-6 py-3 bg-zinc-900 border border-white/5 text-white font-black italic uppercase tracking-widest rounded-xl hover:border-purple-500/50 transition-all text-[10px]">
              Form Charter
            </button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Bounties */}
        <div className="space-y-8 relative">
          <div className="absolute -inset-10 bg-gradient-to-br from-cyan-500/10 to-transparent blur-[100px] pointer-events-none" />

          <div className="flex justify-between items-end px-4 relative z-10">
            <h2 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Zap size={12} className="text-cyan-500" /> Recent Transmissions
            </h2>
            <span className="text-[8px] font-mono text-gray-700 uppercase">
              Live Marketplace Feed
            </span>
          </div>

          <div className="space-y-4 relative z-10">
            {recentBounties.length > 0 ? (
              recentBounties.map((b: any) => (
                <Link key={b.id} href="/bounties">
                  <div className="p-6 bg-zinc-900/20 border border-white/5 rounded-3xl backdrop-blur-xl flex justify-between items-center group hover:border-cyan-500/30 transition-all mb-4">
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
                </Link>
              ))
            ) : (
              <div className="p-12 text-center bg-zinc-900/10 border border-dashed border-white/5 rounded-3xl">
                <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest animate-pulse">
                  Scanning network...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Guilds */}
        <div className="space-y-8 relative">
          <div className="absolute -inset-10 bg-gradient-to-br from-purple-500/10 to-transparent blur-[100px] pointer-events-none" />

          <div className="flex justify-between items-end px-4 relative z-10">
            <h2 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Users size={12} className="text-purple-500" /> Guild
              Registrations
            </h2>
            <span className="text-[8px] font-mono text-gray-700 uppercase">
              Active Charters
            </span>
          </div>

          <div className="space-y-4 relative z-10">
            {recentGuilds.length > 0 ? (
              recentGuilds.map((g: any) => (
                <Link key={g.id} href="/guilds">
                  <div className="p-6 bg-zinc-900/20 border border-white/5 rounded-3xl backdrop-blur-xl flex justify-between items-center group hover:border-purple-500/30 transition-all mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-tight">
                          {g.name}
                        </div>
                        <div className="text-[10px] font-mono text-gray-600 uppercase italic">
                          Master: {g.master.slice(0, 8)}...{g.master.slice(-4)}
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-gray-700 group-hover:text-purple-500 transition-colors"
                    />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-12 text-center bg-zinc-900/10 border border-dashed border-white/5 rounded-3xl">
                <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest animate-pulse">
                  Syncing Codex...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <footer className="pt-20 border-t border-white/5 flex justify-between items-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
        <div className="flex gap-12 font-mono text-[8px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
            <Activity size={10} className="text-cyan-500" /> Protocol Linked
          </div>
          <div className="flex items-center gap-2">
            <Zap size={10} className="text-purple-500" /> Indexer Health: 100%
          </div>
          <div className="flex items-center gap-2">
            <Shield size={10} className="text-green-500" /> Secure Terminal
          </div>
        </div>
        <div className="text-[8px] font-mono uppercase tracking-widest text-gray-600 italic">
          Orbital Cluster • Earth Standard Time
        </div>
      </footer>
    </div>
  );
}

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MNEE_ADDRESS, MNEE_ABI } from "@/lib/contracts";

function FaucetButton() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  return (
    <button
      onClick={() =>
        writeContract({
          address: MNEE_ADDRESS,
          abi: MNEE_ABI,
          functionName: "faucet",
          args: [],
        })
      }
      disabled={isPending || isConfirming}
      className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
    >
      <Zap size={14} className={isPending ? "animate-spin" : ""} />
      {isPending || isConfirming ? "Minting..." : "Get Testnet MNEE"}
    </button>
  );
}
