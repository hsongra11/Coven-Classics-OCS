'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base, optimism, baseSepolia } from 'viem/chains';

export default function PrivyAuthProviders({ children }: { children: React.ReactNode }) {
  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.NEXT_PUBLIC_PRIVY_APP_SECRET;

  if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
    if (!PRIVY_APP_ID) {
      console.error("Privy App ID is missing");
    }
    if (!PRIVY_APP_SECRET) {
      console.error("Privy Secret is missing");
    }
    return null;
  }
  return (

    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'wallet', 'google', 'farcaster'],
        defaultChain: base,
        supportedChains: [optimism, base, baseSepolia],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}