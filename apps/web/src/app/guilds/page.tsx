"use client";

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import {
  GUILD_REGISTRY_ABI,
  GUILD_REGISTRY_ADDRESS,
  MNEE_ABI,
  MNEE_ADDRESS,
} from "@/lib/contracts";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { motion } from "framer-motion";
import { Users, Shield, Zap, Target, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchIndexer, GET_GUILDS } from "@/lib/indexer";
import { formatEther } from "viem";

export default function GuildsPage() {
  const { address } = useAccount();
  const [name, setName] = useState("");
  const [stake, setStake] = useState("500");

  const {
    writeContract: writeGuild,
    data: hash,
    isPending,
  } = useWriteContract();
  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApproving,
  } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  const { isLoading: isApproveConfirming } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { data: indexerData, isLoading: isIndexerLoading } = useQuery({
    queryKey: ["guilds"],
    queryFn: () => fetchIndexer(GET_GUILDS),
    refetchInterval: 10000,
  });

  const { data: contractNextId } = useReadContract({
    address: GUILD_REGISTRY_ADDRESS,
    abi: GUILD_REGISTRY_ABI,
    functionName: "nextGuildId",
  });

  const handleCreate = async () => {
    if (!name) return;
    writeGuild({
      address: GUILD_REGISTRY_ADDRESS,
      abi: GUILD_REGISTRY_ABI,
      functionName: "createGuild",
      args: [name, parseEther(stake), "ipfs://placeholder"],
    });
  };

  const guilds = (indexerData as any)?.guilds || [];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">
            Guild Codex
          </h1>
          <p className="text-gray-500 font-mono text-sm max-w-md">
            The central registry of economic coordination units. Join or form a
            guild to scale your impact.
          </p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 px-6 py-3 rounded-full backdrop-blur-xl">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mr-4">
            Total Registered
          </span>
          <span className="text-xl font-black text-cyan-500 italic">
            {contractNextId ? contractNextId.toString() : "0"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Registration Panel */}
        <div className="xl:col-span-1">
          <div className="sticky top-8 bg-zinc-900/20 border border-white/5 p-8 rounded-[32px] backdrop-blur-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] pointer-events-none" />

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                <Users className="text-cyan-400" size={20} />
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight">
                Form Charter
              </h2>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-mono font-bold text-gray-500 mb-2 uppercase tracking-widest">
                  Guild Designation
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-gray-700"
                  placeholder="e.g. ALPHA SQUADRON"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-500 mb-2 uppercase tracking-widest">
                  Foundation Stake (MNEE)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 focus:ring-1 focus:ring-purple-500/50 outline-none"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 font-mono text-xs italic font-bold">
                    $
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() =>
                    writeApprove({
                      address: MNEE_ADDRESS,
                      abi: MNEE_ABI,
                      functionName: "approve",
                      args: [GUILD_REGISTRY_ADDRESS, parseEther("10000")],
                    })
                  }
                  disabled={isApproving || isApproveConfirming}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[10px] font-bold py-4 rounded-2xl transition-all disabled:opacity-50 border border-white/5 uppercase tracking-widest"
                >
                  {isApproving ? "LOCKING..." : "1. Approve"}
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isPending || isConfirming}
                  className="bg-white hover:bg-purple-500 hover:text-white text-black font-mono text-[10px] font-bold py-4 rounded-2xl transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(168,85,247,0.2)] group uppercase tracking-widest"
                >
                  {isPending ? "ENROLLING..." : "2. Register"}
                </button>
              </div>

              {(isConfirming || isApproveConfirming) && (
                <div className="flex items-center justify-center gap-3 py-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl animate-pulse">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <p className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">
                    Syncing with Registry...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guild Codex Feed */}
        <div className="xl:col-span-2 space-y-8">
          <h2 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest pl-2">
            Authorized Guilds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isIndexerLoading ? (
              <div className="md:col-span-2 p-12 text-center bg-zinc-900/10 border border-dashed border-white/5 rounded-3xl animate-pulse">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                  Accessing Codex via Indexer...
                </p>
              </div>
            ) : guilds.length > 0 ? (
              guilds.map((guild: any) => (
                <GuildCard key={guild.id} guild={guild} />
              ))
            ) : (
              <div className="md:col-span-2 p-12 text-center bg-zinc-900/10 border border-dashed border-white/5 rounded-3xl">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                  No active units registered in the codex.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GuildCard({ guild }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 rounded-[32px] border border-white/5 bg-zinc-900/10 hover:bg-zinc-900/20 hover:border-purple-500/20 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] pointer-events-none" />

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tight group-hover:text-purple-400 transition-colors">
            {guild.name}
          </h3>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">
            ID: #00{guild.id}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-black italic text-purple-400">
          {guild.rank}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">
            Members
          </div>
          <div className="text-xl font-black italic text-white">
            {guild.members}
          </div>
        </div>
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">
            Stake
          </div>
          <div className="text-xl font-black italic text-white">
            {guild.stake}
          </div>
        </div>
      </div>

      <Link href={`/guilds/${guild.id}`}>
        <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 group">
          Access Charter{" "}
          <ArrowUpRight
            size={14}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </button>
      </Link>
    </motion.div>
  );
}
