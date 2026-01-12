"use client";

import { motion } from "framer-motion";
import {
  Settings,
  Bell,
  Shield,
  Share2,
  Globe,
  Cpu,
  Twitter,
  Github,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tighter italic uppercase mb-2">
          Systems Configuration
        </h1>
        <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">
          Adjust your orbital parameters and neural link settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Settings */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest pl-2 flex items-center gap-2">
            <Settings size={12} /> User Profile Override
          </h2>
          <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[32px] backdrop-blur-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">
                  Callsign
                </label>
                <input
                  type="text"
                  placeholder="e.g. NEURALBIRD_01"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 focus:ring-1 focus:ring-cyan-500/50 outline-none text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">
                  Nexus Bio
                </label>
                <input
                  type="text"
                  placeholder="Computational Coordination Specialist"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 focus:ring-1 focus:ring-cyan-500/50 outline-none text-sm transition-all"
                />
              </div>
            </div>
            <button className="px-8 py-3 bg-white text-black font-mono text-xs font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all">
              Update Dossier
            </button>
          </div>
        </section>

        {/* System Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-6">
            <h2 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest pl-2 flex items-center gap-2">
              <Bell size={12} /> Comms Array
            </h2>
            <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[32px] backdrop-blur-xl space-y-4">
              <Toggle
                label="Orbital Notifications"
                description="Receive real-time blockchain event pulses."
                enabled={notifications}
                onChange={setNotifications}
              />
              <Toggle
                label="Stealth Mode"
                description="Mask your hunter activity from the public feed."
                enabled={privacy}
                onChange={setPrivacy}
              />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest pl-2 flex items-center gap-2">
              <Share2 size={12} /> Neural Links
            </h2>
            <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[32px] backdrop-blur-xl space-y-3">
              <SocialBtn
                icon={Twitter}
                label="Twitter / X"
                handle="@mnee_protocol"
              />
              <SocialBtn
                icon={MessageSquare}
                label="Discord"
                handle="GuildsEnclave"
              />
              <SocialBtn
                icon={Github}
                label="Github"
                handle="guilds-of-value"
              />
            </div>
          </section>
        </div>

        {/* Hardware Status */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest pl-2 flex items-center gap-2">
            <Cpu size={12} /> Hardware Diagnostics
          </h2>
          <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[32px] backdrop-blur-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Diagnostic
                label="Viem Relay"
                value="ONLINE"
                color="text-green-400"
              />
              <Diagnostic
                label="Gemini Core"
                value="SYNCED"
                color="text-cyan-400"
              />
              <Diagnostic
                label="IPFS Helia"
                value="ACTIVE"
                color="text-cyan-400"
              />
              <Diagnostic label="Latent Load" value="12ms" color="text-white" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Toggle({ label, description, enabled, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-2">
      <div>
        <div className="text-sm font-bold uppercase tracking-tight mb-1">
          {label}
        </div>
        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-relaxed">
          {description}
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "w-12 h-6 rounded-full transition-all relative border border-white/10",
          enabled ? "bg-cyan-500" : "bg-zinc-800",
        )}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 4 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
        />
      </button>
    </div>
  );
}

function SocialBtn({ icon: Icon, label, handle }: any) {
  return (
    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all group">
      <div className="flex items-center gap-3">
        <Icon
          size={18}
          className="text-zinc-400 group-hover:text-cyan-400 transition-colors"
        />
        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className="text-[10px] font-mono text-gray-600">{handle}</span>
    </button>
  );
}

function Diagnostic({ label, value, color }: any) {
  return (
    <div className="text-center md:text-left">
      <div className="text-[8px] font-mono text-gray-600 uppercase tracking-[0.2em] mb-2">
        {label}
      </div>
      <div
        className={cn(
          "text-sm font-black italic tracking-tighter uppercase",
          color,
        )}
      >
        {value}
      </div>
    </div>
  );
}
