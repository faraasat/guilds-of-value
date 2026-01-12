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

export default function GuildsPage() {
  const { address } = useAccount();
  const [name, setName] = useState("");
  const [stake, setStake] = useState("50");

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

  // Read total guilds (simplified, usually we'd loop or use Graph)
  const { data: nextGuildId } = useReadContract({
    address: GUILD_REGISTRY_ADDRESS,
    abi: GUILD_REGISTRY_ABI,
    functionName: "nextGuildId",
  });

  const handleCreate = async () => {
    if (!name) return;
    try {
      writeGuild({
        address: GUILD_REGISTRY_ADDRESS,
        abi: GUILD_REGISTRY_ABI,
        functionName: "createGuild",
        args: [name, parseEther(stake), "ipfs://placeholder"],
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
        args: [GUILD_REGISTRY_ADDRESS, parseEther("10000")],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-5xl flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Guild Registry
        </h1>
        <ConnectButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-5xl">
        {/* Create Guild Form */}
        <div className="p-8 rounded-xl border border-gray-800 bg-zinc-900/50 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-6">Form a Guild</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Guild Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="e.g. Neural Net Runners"
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Stake MNEE
              </label>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
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
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {isPending ? "Creating..." : "2. Create Guild"}
              </button>
            </div>
            {(isConfirming || isApproveConfirming) && (
              <p className="text-center text-cyan-400 animate-pulse mt-2">
                Confirming on blockchain...
              </p>
            )}
          </div>
        </div>

        {/* Guild List (Mocked/Simple Read for MVP) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Active Guilds</h2>
          <div className="p-6 rounded-xl border border-gray-800 bg-zinc-900/30">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">Total Guilds Created</h3>
                <p className="text-gray-400 mt-2">The registry is live.</p>
              </div>
              <div className="text-4xl font-mono font-bold text-cyan-500">
                {nextGuildId ? nextGuildId.toString() : "0"}
              </div>
            </div>
          </div>

          {/* Example Item */}
          <div className="p-6 rounded-xl border border-gray-800 bg-black/40 hover:border-purple-500/50 transition-colors cursor-pointer">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Genesis Guild</h3>
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                Rank 1
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Master: 0x...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
