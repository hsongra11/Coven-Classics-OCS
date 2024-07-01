"use client"
import { WagmiProvider, createConfig } from '@privy-io/wagmi';
//import { optimism } from 'wagmi/chains';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'viem';

/* export const wagmiConfig = createConfig({
  chains: [optimism],
  transports: {
    [optimism.id]: http(),
  },
}); */

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

export default function WagmiConfigProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}