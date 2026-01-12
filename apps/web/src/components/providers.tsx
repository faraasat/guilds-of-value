"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia, hardhat } from "wagmi/chains";

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: "MNEE Hackathon",
  projectId: "YOUR_PROJECT_ID", // TODO: Move to env
  chains: [hardhat, sepolia, mainnet],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
