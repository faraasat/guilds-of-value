"use client";

import { useState } from "react";
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
} from "@/lib/contracts";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function BountiesPage() {
  const { address } = useAccount();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("100");

  // Create Bounty State
  const {
    writeContract: writeBounty,
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

  // Read Bounties (Simplified: Read Bounty #1 for MVP Demo)
  const { data: bounty1 } = useReadContract({
    address: BOUNTY_ESCROW_ADDRESS,
    abi: BOUNTY_ESCROW_ABI,
    functionName: "bounties",
    args: [BigInt(1)],
  });

  const handleCreate = async () => {
    if (!title) return;
    try {
      writeBounty({
        address: BOUNTY_ESCROW_ADDRESS,
        abi: BOUNTY_ESCROW_ABI,
        functionName: "createBounty",
        args: [title, "ipfs://desc", parseEther(amount), BigInt(86400)], // 24h deadline
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async () => {
    try {
      writeApprove({
        address: MNEE_ADDRESS,
        abi: MNEE_ABI,
        functionName: "approve",
        args: [BOUNTY_ESCROW_ADDRESS, parseEther("10000")],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-5xl flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-green-500">
          Galactic Bounties
        </h1>
        <ConnectButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-5xl">
        {/* Post Bounty */}
        <div className="p-8 rounded-xl border border-gray-800 bg-zinc-900/50 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-6 text-green-400">
            Post New Bounty
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="e.g. Find ZK Research"
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Reward (MNEE)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleApprove}
                disabled={isApproving || isApproveConfirming}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {isApproving ? "Approving..." : "1. Approve MNEE"}
              </button>
              <button
                onClick={handleCreate}
                disabled={isPending || isConfirming}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-400 hover:to-teal-500 text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {isPending ? "Creating..." : "2. Post Bounty"}
              </button>
            </div>
            {(isConfirming || isApproveConfirming) && (
              <p className="text-center text-green-400 animate-pulse mt-2">
                Broadcasting to network...
              </p>
            )}
          </div>
        </div>

        {/* Bounty Feed */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Open Bounties</h2>

          {bounty1 ? (
            // @ts-ignore
            <BountyCard bounty={bounty1} bId={1} />
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-gray-800 text-center text-gray-500">
              No active bounties found. Post one!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BountyCard({ bounty, bId }: { bounty: any; bId: number }) {
  // 0: Open, 1: Assigned, 2: Submitted, 3: Completed
  const statusMap = ["OPEN", "ASSIGNED", "SUBMITTED", "COMPLETED", "CANCELLED"];
  const statusColor = {
    0: "text-green-400 bg-green-400/10",
    1: "text-orange-400 bg-orange-400/10",
    2: "text-blue-400 bg-blue-400/10",
    3: "text-gray-400 bg-gray-400/10",
  };

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-black/40 hover:border-green-500/50 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold group-hover:text-green-400 transition-colors">
          #{bId} {bounty.title}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded font-mono ${
            // @ts-ignore
            statusColor[bounty.status] || "text-gray-500"
          }`}
        >
          {
            // @ts-ignore
            statusMap[bounty.status]
          }
        </span>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">
            {formatEther(bounty.amount)}
          </span>
          <span className="text-sm font-mono text-gray-400">MNEE</span>
        </div>
        <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:scale-105 transition-transform">
          View Details
        </button>
      </div>
    </div>
  );
}
