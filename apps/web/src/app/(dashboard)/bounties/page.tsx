"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  BOUNTY_ESCROW_ABI,
  BOUNTY_ESCROW_ADDRESS,
  MNEE_ABI,
  MNEE_ADDRESS,
  GUILD_GOVERNANCE_ABI,
  GUILD_GOVERNANCE_ADDRESS,
} from "@/lib/contracts";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { uploadToIPFS, fetchFromIPFS } from "@/lib/ipfs";
import { useQuery } from "@tanstack/react-query";
import { fetchIndexer, GET_BOUNTIES } from "@/lib/indexer";
import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Search,
  Target,
  ArrowRight,
  AlertTriangle,
  Gavel,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BountiesPage() {
  const { address } = useAccount();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("500");
  const [activeTab, setActiveTab] = useState("all");

  const {
    writeContract: writeBounty,
    data: hash,
    isPending,
  } = useWriteContract();
  const {
    writeContract: writeApproveMNEE,
    data: approveHash,
    isPending: isApproving,
  } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  const { isLoading: isApproveConfirming } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { data: indexerData, isLoading: isIndexerLoading } = useQuery({
    queryKey: ["bounties"],
    queryFn: () => fetchIndexer(GET_BOUNTIES),
    refetchInterval: 5000,
  });

  const handlePostBounty = async () => {
    if (!title || !description) return;
    try {
      const ipfsUri = await uploadToIPFS(description);
      writeBounty({
        address: BOUNTY_ESCROW_ADDRESS,
        abi: BOUNTY_ESCROW_ABI,
        functionName: "createBounty",
        args: [title, ipfsUri, parseEther(amount), BigInt(86400)],
      });
    } catch (e) {
      console.error("IPFS Upload error:", e);
    }
  };

  const allBounties = (indexerData as any)?.bounties || [];
  const filteredBounties = allBounties.filter((b: any) => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return b.status === 0;
    if (activeTab === "active") return b.status === 1 || b.status === 2;
    return true;
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">
            Mission Hub
          </h1>
          <p className="text-zinc-400 font-mono text-sm max-w-md">
            Browse and deploy autonomous agents for orbital tasks. All rewards
            verifiable on-chain.
          </p>
        </div>
        <div className="flex gap-4 p-1 bg-zinc-900/50 border border-white/5 rounded-full backdrop-blur-xl">
          {["all", "open", "active"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase transition-all",
                activeTab === tab
                  ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                  : "text-zinc-400 hover:text-white",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Post Bounty Panel */}
        <div className="xl:col-span-1">
          <div className="sticky top-8 bg-zinc-900/20 border border-white/5 p-8 rounded-[32px] backdrop-blur-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <Zap className="text-green-400" size={20} />
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight">
                Deploy Manifest
              </h2>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-mono font-bold text-zinc-400 mb-2 uppercase tracking-widest">
                  Mission Objective
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-gray-700"
                  placeholder="e.g. DATA SALVAGE IN SEC-4"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-zinc-400 mb-2 uppercase tracking-widest">
                  Protocol Briefing
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 focus:ring-1 focus:ring-cyan-500/50 outline-none h-40 transition-all placeholder:text-gray-700 resize-none font-mono text-sm leading-relaxed"
                  placeholder="Input technical requirements chain..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-zinc-400 mb-2 uppercase tracking-widest">
                  Reward Allocation (MNEE)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 focus:ring-1 focus:ring-cyan-500/50 outline-none"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-mono text-xs italic font-bold">
                    $
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() =>
                    writeApproveMNEE({
                      address: MNEE_ADDRESS,
                      abi: MNEE_ABI,
                      functionName: "approve",
                      args: [BOUNTY_ESCROW_ADDRESS, parseEther("10000")],
                    })
                  }
                  disabled={isApproving || isApproveConfirming}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold py-4 rounded-2xl transition-all disabled:opacity-50 flex flex-col items-center justify-center gap-1 border border-white/5"
                >
                  <Shield size={16} />
                  {isApproving ? "LOCKING..." : "1. LOCK MNEE"}
                </button>
                <button
                  onClick={handlePostBounty}
                  disabled={isPending || isConfirming}
                  className="bg-white hover:bg-cyan-400 text-black font-mono text-xs font-bold py-4 rounded-2xl transition-all disabled:opacity-50 flex flex-col items-center justify-center gap-1 shadow-[0_4px_20px_rgba(255,255,255,0.1)] group"
                >
                  <Zap size={16} className="group-hover:animate-pulse" />
                  {isPending ? "UPLOADING..." : "2. DEPLOY"}
                </button>
              </div>

              {(isConfirming || isApproveConfirming) && (
                <div className="flex items-center justify-center gap-3 py-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl animate-pulse">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  <p className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    Broadcasting Transaction...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bounty Feed */}
        <div className="xl:col-span-2">
          <div className="space-y-6">
            <h2 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest pl-2">
              Available Missions
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {isIndexerLoading ? (
                <div className="p-12 text-center bg-zinc-900/10 border border-dashed border-white/5 rounded-3xl animate-pulse">
                  <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    Connecting to Orbital Indexer...
                  </p>
                </div>
              ) : filteredBounties.length > 0 ? (
                filteredBounties.map((b: any) => (
                  <BountyItem
                    key={b.id}
                    id={Number(b.id)}
                    data={b}
                    currentUser={address}
                  />
                ))
              ) : (
                <div className="p-12 text-center bg-zinc-900/10 border border-dashed border-white/5 rounded-3xl">
                  <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    No active transmissions in this sector.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BountyItem({
  id,
  data,
  currentUser,
}: {
  id: number;
  data: any;
  currentUser?: string;
}) {
  const [resolvedDesc, setResolvedDesc] = useState("Awaiting uplink...");
  const [resolvedSubmission, setResolvedSubmission] = useState("");

  const { writeContract: approveWork, data: approveHash } = useWriteContract();
  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  useEffect(() => {
    if (data) {
      fetchFromIPFS(data.descriptionURI)
        .then(setResolvedDesc)
        .catch(console.error);
      if (data.submissionURI) {
        fetchFromIPFS(data.submissionURI)
          .then(setResolvedSubmission)
          .catch(console.error);
      }
    }
  }, [data]);

  if (!data || data.createdAt === "0") return null;

  const {
    writeContract: raiseDispute,
    data: disputeHash,
    isPending: isDisputing,
  } = useWriteContract();
  const { isLoading: isDisputeConfirming } = useWaitForTransactionReceipt({
    hash: disputeHash,
  });

  const statusMap = ["OPEN", "CLAIMED", "SUBMITTED", "COMPLETED", "VOIDED"];
  const isCreator = currentUser?.toLowerCase() === data.creator.toLowerCase();
  const isHunter = currentUser?.toLowerCase() === data.hunter?.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 rounded-[32px] border border-white/5 bg-zinc-900/10 hover:bg-zinc-900/20 hover:border-cyan-500/20 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] pointer-events-none" />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex gap-6">
          <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center group-hover:border-cyan-500/30 transition-colors">
            <span className="text-[10px] font-mono text-gray-600 font-bold">
              UID
            </span>
            <span className="text-xl font-black italic">#{id}</span>
          </div>
          <div>
            <h3 className="text-2xl font-black italic uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
              {data.title}
            </h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                <Shield size={10} className="text-cyan-500" />{" "}
                {data.creator.slice(0, 6)}...{data.creator.slice(-4)}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-800" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                Protocol V2.1
              </span>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-mono font-black italic uppercase tracking-widest",
            data.status === 2
              ? "bg-cyan-500 text-black animate-pulse"
              : data.status === 3
                ? "bg-white/5 text-zinc-400"
                : "bg-green-500/10 text-green-400 border border-green-500/20",
          )}
        >
          {statusMap[data.status]}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black/40 p-6 rounded-2xl border border-white/5 relative">
          <div className="flex items-center gap-2 mb-4 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            <Search size={12} className="text-cyan-500" /> Transmission Payload
          </div>
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            {resolvedDesc}
          </p>
        </div>

        {(data.status === 2 || data.status === 3) && (
          <div className="bg-cyan-500/5 p-6 rounded-2xl border border-cyan-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/10 blur-[30px]" />
            <div className="flex items-center gap-2 mb-4 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              <Zap size={12} className="animate-pulse" /> Hunter Deliverable
            </div>
            <div className="text-xs font-mono text-cyan-100/80 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-32 custom-scrollbar">
              {resolvedSubmission || "Awaiting extraction..."}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black italic tracking-tighter text-white">
            {formatEther(BigInt(data.amount))}
          </div>
          <div className="px-3 py-1 bg-white text-black text-[10px] font-black italic tracking-widest uppercase rounded">
            MNEE
          </div>
        </div>

        <div className="flex gap-4">
          {isHunter && data.status === 2 && (
            <button
              onClick={() =>
                raiseDispute({
                  address: GUILD_GOVERNANCE_ADDRESS,
                  abi: GUILD_GOVERNANCE_ABI,
                  functionName: "raiseDispute",
                  args: [BigInt(id)],
                })
              }
              disabled={isDisputing || isDisputeConfirming}
              className="px-6 py-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <AlertTriangle size={14} />{" "}
              {isDisputing ? "ESCALATING..." : "Raise Dispute"}
            </button>
          )}

          {isCreator && data.status === 2 && (
            <>
              <button
                onClick={() =>
                  raiseDispute({
                    address: GUILD_GOVERNANCE_ADDRESS,
                    abi: GUILD_GOVERNANCE_ABI,
                    functionName: "raiseDispute",
                    args: [BigInt(id)],
                  })
                }
                disabled={isDisputing || isDisputeConfirming}
                className="px-6 py-4 bg-zinc-800 text-gray-400 font-mono text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-zinc-700 transition-all disabled:opacity-50"
              >
                {isDisputing ? "DENYING..." : "Deny Claim"}
              </button>
              <button
                onClick={() =>
                  approveWork({
                    address: BOUNTY_ESCROW_ADDRESS,
                    abi: BOUNTY_ESCROW_ABI,
                    functionName: "approveWork",
                    args: [BigInt(id)],
                  })
                }
                disabled={isApproving}
                className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black italic uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:scale-105"
              >
                {isApproving ? "SETTLING..." : "Settle Payout"}
              </button>
            </>
          )}

          {(disputeHash || data.status === 4) && (
            <Link href="/governance">
              <button className="px-6 py-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-purple-500/20 transition-all flex items-center gap-2">
                View Case <Gavel size={14} />
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
