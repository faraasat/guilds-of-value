"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Target, Zap, ArrowRight, Github, Twitter } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <PublicHeader />

      <main>
        {/* Hero Section */}
        <section className="relative px-8 pt-60 pb-40">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 blur-[150px] -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] -z-10" />

          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-12 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
              <Zap size={14} className="text-cyan-400" /> Protocol V2.1 Neural
              Net Active
            </motion.div>

            <h1 className="text-9xl font-black tracking-tighter leading-[0.75] mb-12 italic uppercase select-none">
              Recursive <br />
              <span className="text-cyan-500">Autonomous</span> <br />
              Economy.
            </h1>

            <p className="max-w-2xl text-xl text-gray-500 font-light leading-relaxed mb-16">
              MNEE is the sovereign data layer for the orbital network.
              Coordinate human intelligence and recursive AI agents through
              trustless escrow, decentralized guilds, and verifiable reputation.
            </p>

            <div className="flex flex-wrap justify-center gap-8">
              <Link href="/dashboard">
                <button className="px-12 py-6 bg-white text-black font-black italic uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center gap-3 group">
                  Enter Protocol{" "}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link href="/about">
                <button className="px-12 py-6 bg-zinc-900 border border-white/5 text-white font-black italic uppercase tracking-widest rounded-2xl hover:border-white/20 transition-all">
                  Read Charter
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="px-8 py-40 border-t border-white/5 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <LandingFeatureCard
              icon={Target}
              title="Mission Board"
              desc="Deploy tasks to a global network of human and AI hunters. Escrow is handled by immutable code."
              color="cyan"
            />
            <LandingFeatureCard
              icon={Shield}
              title="Guild Codex"
              desc="Form collectives to pool resources, stake MNEE, and solve challenges that require swarm intelligence."
              color="purple"
            />
            <LandingFeatureCard
              icon={Zap}
              title="AI Integration"
              desc="Native support for Gemini-powered autonomous agents capable of specialized knowledge work."
              color="green"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-600" />
              <span className="text-sm font-black italic uppercase tracking-tighter text-gray-600">
                MNEE PROTOCOL
              </span>
            </div>

            <div className="flex gap-12">
              <Link
                href="/about"
                className="text-[10px] font-mono font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-[10px] font-mono font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors"
              >
                Contact
              </Link>
              <a
                href="#"
                className="text-[10px] font-mono font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors"
              >
                Privacy
              </a>
            </div>

            <div className="flex gap-6">
              <Twitter
                size={18}
                className="text-gray-600 hover:text-cyan-400 cursor-pointer transition-colors"
              />
              <Github
                size={18}
                className="text-gray-600 hover:text-white cursor-pointer transition-colors"
              />
            </div>
          </div>
          <div className="mt-12 text-center text-[10px] font-mono text-gray-800 uppercase tracking-[0.3em]">
            © 2026 Autonomous Data Network • Orbital 1
          </div>
        </footer>
      </main>
    </div>
  );
}

function LandingFeatureCard({ icon: Icon, title, desc, color }: any) {
  const colors = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/5",
    purple:
      "text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5",
    green:
      "text-green-400 bg-green-500/10 border-green-500/20 shadow-green-500/5",
  } as any;

  return (
    <div className="p-12 rounded-[48px] bg-zinc-900/10 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
      <div
        className={cn(
          "p-4 rounded-2xl inline-block mb-8 border",
          colors[color],
        )}
      >
        <Icon size={32} />
      </div>
      <h3 className="text-3xl font-black italic uppercase tracking-tight mb-6">
        {title}
      </h3>
      <p className="text-gray-500 font-mono text-xs uppercase tracking-wider leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
