"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { MNEE_ABI, MNEE_ADDRESS } from "@/lib/contracts";
import { motion } from "framer-motion";
import { Shield, Zap, Target, Award, Activity, Globe } from "lucide-react";

export default function ProfilePage() {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    address: MNEE_ADDRESS,
    abi: MNEE_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  if (!address) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Globe size={48} className="text-gray-700 animate-pulse" />
        <h1 className="text-xl font-mono text-zinc-400 uppercase tracking-widest">
          Connect Wallet to Access Dossier
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Profile Header */}
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-cyan-400 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-[38px] bg-black flex items-center justify-center overflow-hidden">
                <div className="text-4xl font-black italic text-white leading-none">
                  ID
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 border-4 border-black flex items-center justify-center">
              <Shield size={16} className="text-black" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black tracking-tighter italic uppercase">
                Agent {address.slice(0, 8)}
              </h1>
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase">
                Verified Hunter
              </span>
            </div>
            <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} /> Global Registry ID: {address}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Balance"
          value={
            balance
              ? `${parseFloat(formatEther(balance as bigint)).toFixed(2)}`
              : "0.00"
          }
          unit="MNEE"
          icon={Zap}
          color="text-cyan-400"
        />
        <StatCard
          label="Trust Score"
          value="98"
          unit="PX"
          icon={Shield}
          color="text-green-400"
        />
        <StatCard
          label="Missions"
          value="12"
          unit="OPS"
          icon={Target}
          color="text-purple-400"
        />
        <StatCard
          label="Reputation"
          value="Lvl 4"
          unit="RANK"
          icon={Award}
          color="text-orange-400"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest pl-2 flex items-center gap-2">
            <Activity size={12} /> Operational History
          </h2>
          <div className="space-y-4">
            <ActivityItem
              title="Bounty #234 - Data Scrape"
              status="COMPLETED"
              reward="+500 MNEE"
              date="2h ago"
            />
            <ActivityItem
              title="Guild Stake Increment"
              status="SIGNED"
              reward="-100 MNEE"
              date="5h ago"
            />
            <ActivityItem
              title="Profile Verification"
              status="SUCCESS"
              reward="0 MNEE"
              date="1d ago"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest pl-2">
            Security Clearance
          </h2>
          <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[32px] backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400 italic">Auth Level</span>
                <span className="text-white">Tier 1 Alpha</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400 italic">Enclave Key</span>
                <span className="text-cyan-500">ECDSA-Valid</span>
              </div>
              <div className="h-[1px] bg-white/5" />
              <p className="text-[10px] text-gray-600 font-mono leading-relaxed uppercase">
                Your account is currently synced with the main orbital relay.
                Ensure MNEE staking for higher priority task allocation.
              </p>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all">
                Upgrade Clearance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, icon: Icon, color }: any) {
  return (
    <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[32px] backdrop-blur-xl hover:border-white/10 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-xl bg-white/5", color)}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-3xl font-black italic tracking-tighter mb-1 uppercase">
        {value}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">
          {label}
        </span>
        <span className="px-1.5 py-0.5 bg-white/5 rounded text-[8px] font-mono text-gray-600 font-bold">
          {unit}
        </span>
      </div>
    </div>
  );
}

function ActivityItem({ title, status, reward, date }: any) {
  return (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/10 border border-white/5 hover:bg-zinc-900/20 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-cyan-500 group-hover:animate-ping" />
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-tight">
            {title}
          </div>
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            {date}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs font-mono font-bold text-cyan-400 mb-1">
          {reward}
        </div>
        <div className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
          {status}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
