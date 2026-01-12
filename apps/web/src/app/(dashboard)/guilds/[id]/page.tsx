"use client";

import { useParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { GUILD_REGISTRY_ABI, GUILD_REGISTRY_ADDRESS } from "@/lib/contracts";
import { formatEther } from "viem";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Zap,
  Target,
  Activity,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function GuildDetailPage() {
  const { id } = useParams();

  const { data: guild } = useReadContract({
    address: GUILD_REGISTRY_ADDRESS,
    abi: GUILD_REGISTRY_ABI,
    functionName: "guilds" as any,
    args: [BigInt(id as string)],
  });

  if (!guild || (guild as any).createdAt === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Shield size={48} className="text-gray-800 animate-pulse" />
        <h1 className="text-xl font-mono text-zinc-400 uppercase tracking-widest">
          Guild Record Not Found
        </h1>
        <Link
          href="/guilds"
          className="text-cyan-500 font-mono text-xs uppercase hover:underline"
        >
          Return to Codex
        </Link>
      </div>
    );
  }

  const g = guild as any;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <Link
        href="/guilds"
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
          Back to Codex
        </span>
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-8 items-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <Users size={40} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-black tracking-tighter italic uppercase">
                {g.name}
              </h1>
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase">
                Verified Nexus
              </span>
            </div>
            <div className="flex items-center gap-6 mt-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Shield size={12} className="text-purple-500" /> Master:{" "}
                {g.master.slice(0, 6)}...{g.master.slice(-4)}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={12} className="text-purple-500" /> Member Count: 1
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1 italic">
            Guild Stake
          </div>
          <div className="text-4xl font-black italic tracking-tighter text-white">
            {parseFloat(formatEther(g.totalStake)).toLocaleString()}{" "}
            <span className="text-lg text-purple-400">MNEE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Charter Info */}
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-zinc-900/20 border border-white/5 p-10 rounded-[40px] backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />
            <h2 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Activity size={14} className="text-cyan-500" /> Mission
              Directives
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed mb-8">
              Established for the purpose of autonomous coordination and value
              generation. Specializing in high-frequency computational tasks and
              distributed intelligence governance.
            </p>
            <div className="grid grid-cols-3 gap-8">
              <Stat label="Reputation" value="Level 4" />
              <Stat label="Success Rate" value="98.2%" />
              <Stat label="Last Active" value="2h ago" />
            </div>
          </div>

          {/* Member List placeholder */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest pl-2 flex items-center gap-2">
              <Users size={12} /> Active Stakeholders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-zinc-900/10 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900" />
                  <span className="font-mono text-sm">
                    {g.master.slice(0, 12)}...
                  </span>
                </div>
                <span className="text-[8px] font-mono px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded uppercase">
                  Master
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          <div className="bg-zinc-900/40 p-8 rounded-[32px] border border-white/5 space-y-8">
            <div className="flex items-center gap-3">
              <Trophy size={20} className="text-yellow-500" />
              <h3 className="text-lg font-black italic uppercase italic tracking-tight">
                Guild Assets
              </h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2">
                  Primary Reserve
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black italic">
                    {parseFloat(formatEther(g.totalStake)).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-gray-600 mb-1">
                    MNEE
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2">
                  Governance Yield
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black italic text-green-400">
                    12.4%
                  </span>
                  <span className="text-[10px] font-mono text-gray-600 mb-1">
                    APR
                  </span>
                </div>
              </div>
            </div>
            <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black italic uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_30px_rgba(147,51,234,0.3)]">
              Delegate Stake
            </button>
          </div>

          <div className="p-8 rounded-[32px] border border-white/5 bg-zinc-900/10 text-center">
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-4 italic">
              Protocol ID
            </div>
            <div className="text-[8px] font-mono text-gray-700 break-all">
              {GUILD_REGISTRY_ADDRESS}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div>
      <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="text-lg font-black italic text-white uppercase">
        {value}
      </div>
    </div>
  );
}
