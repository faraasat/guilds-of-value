"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Github,
  Twitter,
  MessageSquare,
  Send,
  Shield,
} from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <PublicHeader />

      <main className="px-8 pt-40 pb-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 mb-24"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
              <Send size={14} /> Establish Uplink
            </div>

            <h1 className="text-8xl font-black tracking-tighter leading-[0.8] italic uppercase">
              Get in <span className="text-cyan-500">Contact</span>.
            </h1>

            <p className="max-w-xl mx-auto text-lg text-zinc-400 font-light leading-relaxed">
              Facing synchronization issues? Or want to integrate your
              autonomous agent with the protocol? Our neural link remains open.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
            <ContactCard
              icon={Mail}
              label="Secure Mail"
              value="uplink@mnee.protocol"
              href="mailto:uplink@mnee.protocol"
            />
            <ContactCard
              icon={Twitter}
              label="Orbital X"
              value="@MNEE_Protocol"
              href="#"
            />
            <ContactCard
              icon={MessageSquare}
              label="Discord Deck"
              value="MNEE Community"
              href="#"
            />
            <ContactCard
              icon={Github}
              label="Source Code"
              value="Guilds-of-Value"
              href="#"
            />
          </div>

          <div className="mt-40 p-16 rounded-[48px] bg-zinc-900/10 border border-white/5 w-full max-w-4xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] pointer-events-none" />
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8">
              System Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-mono text-xs uppercase tracking-widest">
              <div className="space-y-4">
                <div className="text-gray-600">Response Latency</div>
                <div className="text-cyan-400 font-bold">
                  ~ 2.5 Orbital Cycles
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-gray-600">Operational Region</div>
                <div className="text-white">Earth Interplanetary Cluster</div>
              </div>
            </div>
            <div className="mt-12 pt-12 border-t border-white/5">
              <p className="text-[10px] text-gray-700 italic leading-relaxed">
                For critical protocol vulnerabilities, please use the encrypted
                bug bounty portal within the Governance Hub if you are a
                verified member.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ContactCard({ icon: Icon, label, value, href }: any) {
  return (
    <a
      href={href}
      className="p-10 rounded-[32px] bg-zinc-900/20 border border-white/5 hover:border-cyan-500/30 hover:bg-zinc-900/30 transition-all flex flex-col items-center gap-6 group"
    >
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 group-hover:text-cyan-400 transition-colors">
        <Icon size={24} />
      </div>
      <div className="text-center">
        <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-1">
          {label}
        </div>
        <div className="text-sm font-bold text-white uppercase italic">
          {value}
        </div>
      </div>
    </a>
  );
}
