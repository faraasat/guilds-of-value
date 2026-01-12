"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Users,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Search,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "DASHBOARD", icon: LayoutDashboard, href: "/" },
  { label: "MARKETPLACE", icon: Target, href: "/bounties" },
  { label: "GUILDS", icon: Users, href: "/guilds" },
  { label: "GOVERNANCE", icon: Shield, href: "/governance" },
  { label: "PROFILE", icon: User, href: "/profile" },
  { label: "SETTINGS", icon: Settings, href: "/settings" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-[length:50px_50px]" />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        className="relative h-full bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col z-40"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600"
            >
              GUILDS OF VALUE
            </motion.div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Local Feed / Status Line */}
        {!collapsed && (
          <div className="px-6 py-4 flex items-center gap-2 border-b border-white/5 bg-cyan-500/5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest">
              Orbital Link Active
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative",
                    isActive
                      ? "bg-white/5 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                      : "text-gray-500 hover:text-white hover:bg-white/5",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-full"
                    />
                  )}
                  <item.icon
                    size={22}
                    className={cn(isActive && "text-cyan-400")}
                  />
                  {!collapsed && (
                    <span className="text-sm font-bold tracking-tight uppercase">
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Stats */}
        {!collapsed && (
          <div className="p-6 border-t border-white/5 space-y-4">
            <div className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  Network Load
                </span>
                <span className="text-[10px] font-mono text-green-400">
                  Stable
                </span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-3/4 animate-pulse duration-[2s]" />
              </div>
            </div>
            <div className="flex justify-center">
              <ConnectButton
                accountStatus="avatar"
                chainStatus="icon"
                showBalance={false}
              />
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 relative z-30">
          <div className="flex items-center gap-4 text-sm font-mono text-gray-500">
            <Activity size={16} className="text-cyan-500" />
            <span className="uppercase tracking-widest">Live Orbital Feed</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search index..."
                className="bg-zinc-900/50 border border-white/5 rounded-full pl-10 pr-4 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500/50 transition-all w-64"
              />
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* CRT Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-50 bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
