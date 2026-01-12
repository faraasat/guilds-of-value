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
    writeContract: writeApproveMNEE,
    data: approveHash,
    isPending: isApproving,
  } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  const { isLoading: isApproveConfirming } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Fetch multiple bounties (Simplified for MVP)
  const bountyIds = [1, 2, 3, 4, 5];

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
                onClick={() => {
                  writeApproveMNEE({
                    address: MNEE_ADDRESS,
                    abi: MNEE_ABI,
                    functionName: "approve",
                    args: [BOUNTY_ESCROW_ADDRESS, parseEther("10000")],
                  });
                }}
                disabled={isApproving || isApproveConfirming}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {isApproving ? "Approving..." : "1. Approve MNEE"}
              </button>
              <button
                onClick={() => {
                  writeBounty({
                    address: BOUNTY_ESCROW_ADDRESS,
                    abi: BOUNTY_ESCROW_ABI,
                    functionName: "createBounty",
                    args: [
                      title,
                      "ipfs://desc",
                      parseEther(amount),
                      BigInt(86400),
                    ],
                  });
                }}
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
          <h2 className="text-2xl font-bold mb-6">Active Feed</h2>
          {bountyIds.map((id) => (
            <BountyItem key={id} id={id} currentUser={address} />
          ))}
        </div>
      </div>
    </main>
  );
}

function BountyItem({ id, currentUser }: { id: number; currentUser?: string }) {
  const { data: bounty, refetch } = useReadContract({
    address: BOUNTY_ESCROW_ADDRESS,
    abi: BOUNTY_ESCROW_ABI,
    functionName: "bounties",
    args: [BigInt(id)],
  });

  const { writeContract: approveWork, data: approveHash } = useWriteContract();
  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  if (!bounty || (bounty as any).createdAt === 0n) return null;

  const b = bounty as any;
  const statusMap = ["OPEN", "ASSIGNED", "SUBMITTED", "COMPLETED", "CANCELLED"];
  const isCreator = currentUser?.toLowerCase() === b.creator.toLowerCase();

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-black/40 hover:border-green-500/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">
            #{id} {b.title}
          </h3>
          <p className="text-xs font-mono text-gray-500 mt-1">
            Creator: {b.creator.slice(0, 6)}...{b.creator.slice(-4)}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded font-mono ${
            b.status === 2
              ? "bg-blue-500/20 text-blue-400 animate-pulse"
              : b.status === 3
                ? "bg-gray-500/20 text-gray-400"
                : "bg-green-500/20 text-green-400"
          }`}
        >
          {statusMap[b.status]}
        </span>
      </div>

      <div className="bg-zinc-900/30 p-4 rounded-lg border border-gray-800 mb-4">
        <p className="text-sm text-gray-300 italic">DESCRIPTION PREVIEW:</p>
        <p className="text-sm text-gray-400">{b.descriptionURI}</p>

        {(b.status === 2 || b.status === 3) && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-sm text-cyan-400 font-bold mb-1">
              AI SUBMISSION:
            </p>
            <div className="text-xs bg-black/60 p-3 rounded font-mono text-cyan-200 border border-cyan-500/30">
              {b.submissionURI || "Awaiting AI delivery..."}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">
            {formatEther(b.amount)}
          </span>
          <span className="text-sm font-mono text-gray-400">MNEE</span>
        </div>

        {isCreator && b.status === 2 && (
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
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all"
          >
            {isApproving ? "Finalizing..." : "Approve & Pay"}
          </button>
        )}
      </div>
    </div>
  );
}
