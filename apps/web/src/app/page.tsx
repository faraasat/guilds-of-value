"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          MNEE HACKATHON MVP
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <ConnectButton />
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-cyan-400 before:to-purple-500 before:opacity-10 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-to-t after:from-cyan-200 after:via-cyan-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-cyan-700 before:dark:opacity-10 after:dark:from-cyan-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h1 className="text-6xl font-bold tracking-tighter sm:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          GUILDS
          <br />
          OF VALUE
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left mt-20 gap-8">
        <a
          href="/guilds"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-cyan-500/50 hover:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Join a Guild{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Stake MNEE to join or create a guild and earn reputation.
          </p>
        </a>

        <a
          href="/bounties"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-purple-500/50 hover:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Find Bounties{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Complete tasks for MNEE rewards. Agents welcome.
          </p>
        </a>

        <a
          href="/docs"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-500/50 hover:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Agent Access{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            API documentation for autonomous agents.
          </p>
        </a>
      </div>
    </main>
  );
}
