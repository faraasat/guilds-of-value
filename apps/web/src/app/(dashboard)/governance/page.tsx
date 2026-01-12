"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Vote,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Gavel,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  GUILD_GOVERNANCE_ABI,
  GUILD_GOVERNANCE_ADDRESS,
} from "@/lib/contracts";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
import { fetchIndexer, GET_DISPUTES } from "@/lib/indexer";
import { formatEther } from "viem";

export default function GovernancePage() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("active");

  const { data: indexerData, isLoading: isIndexerLoading } = useQuery({
    queryKey: ["disputes"],
    queryFn: () => fetchIndexer(GET_DISPUTES),
    refetchInterval: 5000,
  });

  const allDisputes = (indexerData as any)?.disputes || [];
  const filteredDisputes = allDisputes.filter((d: any) => {
    if (activeTab === "active") return !d.resolved;
    if (activeTab === "resolved") return d.resolved;
    return true;
  });

  const { writeContract: writeVote, data: voteHash } = useWriteContract();
  const { isLoading: isVotingConfirming } = useWaitForTransactionReceipt({
    hash: voteHash,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">
            Governance Hub
          </h1>
          <p className="text-gray-500 font-mono text-sm max-w-md">
            The Supreme Court of the Autonomous Economy. Guild Masters
            adjudicate disputes and coordinate protocol upgrades.
          </p>
        </div>
        <div className="flex gap-4 p-1 bg-zinc-900/50 border border-white/5 rounded-full backdrop-blur-xl">
          {["active", "resolved", "proposals"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase transition-all",
                activeTab === tab
                  ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  : "text-gray-500 hover:text-white",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Adjudication Sidebar */}
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[32px] backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Gavel size={20} className="text-cyan-400" />
              </div>
              <h2 className="text-xl font-black italic uppercase italic tracking-tight">
                Council Status
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-500 uppercase tracking-widest">
                  Active Masters
                </span>
                <span className="text-white">12 Units</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-500 uppercase tracking-widest">
                  Quorum Floor
                </span>
                <span className="text-white">51%</span>
              </div>
              <div className="h-[1px] bg-white/5" />
              <p className="text-[10px] text-gray-600 font-mono leading-relaxed uppercase">
                Only verified Guild Masters are eligible to cast votes on
                dispute resolution cases. Stake MNEE in your guild to increase
                your influence.
              </p>
            </div>
          </div>

          <div className="bg-purple-500/5 border border-purple-500/10 p-8 rounded-[32px] backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-3">
              <Info size={18} className="text-purple-400" />
              <h3 className="text-sm font-bold uppercase tracking-tight">
                Protocol Advisory
              </h3>
            </div>
            <p className="text-[10px] text-gray-400 font-mono leading-relaxed italic">
              A dispute can be raised by any hunter whose work was rejected by a
              creator. The council will review the IPFS submission and the
              mission brief to decide on the payout.
            </p>
          </div>
        </div>

        {/* Dispute Feed */}
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest pl-2 flex items-center gap-2">
            <AlertCircle size={12} /> Pending Adjudication
          </h2>
          <div className="space-y-4">
          <div className="space-y-4">
            {isIndexerLoading ? (
              <div className="p-12 text-center bg-zinc-900/10 border border-dashed border-white/5 rounded-3xl animate-pulse">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                  Decrypting Adjudication Records...
                </p>
              </div>
            ) : filteredDisputes.length > 0 ? (
              filteredDisputes.map((d: any) => (
                <DisputeCard 
                  key={d.id} 
                  dispute={d} 
                  onVote={(support: boolean) => writeVote({
                    address: GUILD_GOVERNANCE_ADDRESS,
                    abi: GUILD_GOVERNANCE_ABI,
                    functionName: "vote",
                    args: [BigInt(d.id), support],
                  })}
                  isVoting={isVotingConfirming}
                />
              ))
            ) : (
              <div className="p-12 text-center bg-zinc-900/10 border border-dashed border-white/5 rounded-3xl">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                  No active disputes in the sector.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DisputeCard({ dispute, onVote, isVoting }: { dispute: any; onVote: (s: boolean) => void; isVoting: boolean }) {
  const resolved = dispute.resolved;
  const votesFor = Number(dispute.votesFor || 0);
  const votesAgainst = Number(dispute.votesAgainst || 0);
  const totalVotes = votesFor + votesAgainst;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/10 border border-white/5 p-8 rounded-[32px] hover:bg-zinc-900/20 transition-all group relative overflow-hidden"
    >
      {!resolved && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] pointer-events-none" />
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4 items-center">
          <div
            className={cn(
              "p-3 rounded-2xl",
              !resolved ? "bg-purple-500/10 text-purple-400" : "bg-green-500/10 text-green-400",
            )}
          >
            <Shield size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tight group-hover:text-purple-400 transition-colors">
              Bounty Dispute Case
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                UID: #{dispute.id}
              </span>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Raiser: {dispute.raiser.slice(0, 6)}...{dispute.raiser.slice(-4)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            {resolved ? "RESOLVED" : "VOTING ACTIVE"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            Council Consensus
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-cyan-500"
                style={{
                  width: totalVotes > 0 ? `${(votesFor / totalVotes) * 100}%` : "0%",
                }}
              />
              <div
                className="h-full bg-red-500"
                style={{
                  width: totalVotes > 0 ? `${(votesAgainst / totalVotes) * 100}%` : "0%",
                }}
              />
            </div>
            <div className="text-[10px] font-mono text-white font-bold">
              {votesFor} For / {votesAgainst} Against
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 font-mono text-[10px] uppercase">
          {!resolved ? (
            <>
              <button 
                onClick={() => onVote(true)}
                disabled={isVoting}
                className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold shadow-[0_4px_15px_rgba(34,211,238,0.2)] hover:bg-cyan-400 transition-all disabled:opacity-50"
              >
                Support Payout
              </button>
              <button 
                onClick={() => onVote(false)}
                disabled={isVoting}
                className="px-6 py-3 rounded-xl bg-zinc-800 text-white font-bold border border-white/5 hover:bg-zinc-700 transition-all disabled:opacity-50"
              >
                Reject Claim
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-xl border border-green-400/20">
              <CheckCircle2 size={14} /> <span>Case Closed</span>
            </div>
          )}
        </div>
      </div>

      <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 font-mono text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2">
        Access Evidence Logs <Gavel size={14} />
      </button>
    </motion.div>
  );
}
