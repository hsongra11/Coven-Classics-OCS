'use client'
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSwitchChain, useWalletClient } from 'wagmi';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReadContract } from "./_wagmi";

const PdfViewer = dynamic(() => import('./_component/PdfViewer'), {
  ssr: false
});


export default function Home() {
  const {
    ready,
    authenticated,
    user,
    logout } = usePrivy();
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const {
    error: switchNetworkError,
    switchChain,
  } = useSwitchChain();
  const { wallets } = useWallets();
  const [showContract, setShowContract] = useState(false);
  const [userName, setUserName] = useState("");
  const [chainId, setChainId] = useState<string | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  useEffect(() => {
    if (ready) {
      if (!authenticated) {
        redirect("/");
      } else {
        //console.log("user -> ", user?.linkedAccounts?.[0]);
        setUserName((user?.linkedAccounts?.[0] as { name: string })?.name || "");
      }
    }
  }, [ready, authenticated, user]);

  useEffect(() => {
    if (!walletClient) return;

    walletClient?.getChainId().then((chainId) => {
      //console.log("chain id = ", wallets);
      if (chainId !== 8453) {
        //console.log("not set chain");
        switchChain({ chainId: 8453 });
      }
      setChainId(chainId.toString());
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletClient]);


  return (
    <>
      {user?.wallet?.address &&
        <div className="pt-3">
          <ReadContract />

        </div>
      }

      {showPdf && user?.wallet?.address &&
        <>
          <div className="pt-3">

          </div>
        </>
      }
    </>
  );
}
