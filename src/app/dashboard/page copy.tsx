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
      <div className="p-1 lg:p-8 flex justify-center items-center h-screen ">
        <Card className="overflow-x-auto">
          <CardHeader>
            <CardTitle>Welcome {userName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p>User Id :  <b>{user?.id}</b></p>
              <ul>

                <li>Wallet: {user?.wallet ? user?.wallet.address : 'None'}</li>
              </ul>
            </div>
            <div className="pt-3">
              {user &&
                <div>
                  <Button variant="secondary" onClick={() => setShowContract(!showContract)}>Read Contract</Button>
                </div>
              }

              {showContract && user?.wallet?.address &&
                <>
                  <div className="pt-3">
                    <ReadContract />
                  </div>
                </>
              }
            </div>
            <div>
              {chainId &&
                <div>
                  Chain Id : {chainId}
                </div>
              }
              {/* {user &&
              <textarea
                value={JSON.stringify(user, null, 2)}
                className="mt-2 w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50 sm:text-sm"
                rows={JSON.stringify(user, null, 2).split('\n').length}
                disabled
              />
            } */}
            </div>

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={logout}>Logout</Button>
            <Button variant="secondary" onClick={() => setShowPdf(true)}>Show PDF</Button>
            <Link href="dashboard/send_transaction" >Send</Link>
          </CardFooter>
          <div className="p-3">
            {showPdf &&
              <><p>Scroll down to view pdf</p></>
            }
          </div>
        </Card>
      </div>
      <div className="pt-8">
        {showPdf &&
          <PdfViewer />
        }

      </div>
    </>
  );
}
