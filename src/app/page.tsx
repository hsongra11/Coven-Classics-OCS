'use client';
/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image';
import Pay_Button from './_component/Pay_Button';
import { useEffect, useState } from 'react';

import { usePrivy } from "@privy-io/react-auth";

import { useSwitchChain, useWalletClient } from 'wagmi';
import { parseEther } from 'viem';
import Swal from 'sweetalert2';

import {
  type BaseError,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';

import { useRouter } from 'next/navigation'
import { Account_Link_Box } from './_component/Account_Link_Dialog';


export default function HomePage() {
  const router = useRouter();
  const [isUserInAllowList, setIsUserInAllowList] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);
  const [mintStatus, setMintStatus] = useState<string>("pending");
  const [mintData, setMintData] = useState(null); // [to,amount,id,data
  const {
    ready,
    login,
    logout,
    authenticated,
    user,
    linkFarcaster,
    linkEmail,

  } = usePrivy();

  const { data: walletClient } = useWalletClient();

  const [chainId, setChainId] = useState<string | null>(null);
  const {
    error: switchNetworkError,
    switchChain,
  } = useSwitchChain();

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

  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction();

  const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
  const baseAmountString = process.env.NEXT_PUBLIC_BASE_AMOUNT;
  const baseAmount = Number(baseAmountString);
  const handleCryptoPurchase = () => {

    if (walletAddress && baseAmount && !isNaN(baseAmount)) {
      const newAmount = isUserInAllowList ? baseAmount / 2 : baseAmount;
      const totalAmount = newAmount * quantity;
      sendTransaction({ to: walletAddress as `0x${string}`, value: parseEther(totalAmount.toString()) });
    }
  }

  const checkIfInAllowList = async (authType: 'Email' | 'Farcaster') => {
    if (authType == 'Email' && user?.email?.address) {
      let apiResp = await fetch(process.env.NEXT_PUBLIC_API_URL+"/allowlist", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_id: user?.email?.address
        }),
      });
      const json = await apiResp.json();
      console.log(json);
      if (json.data != null) {
        setIsUserInAllowList(true);
        return true;
      }
      return false;

    } else if (authType == 'Farcaster' && user?.farcaster?.fid) {
      let apiResp = await fetch(process.env.NEXT_PUBLIC_API_URL+"/allowlist", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farcasterid: user?.farcaster?.fid
        }),
      });
      const json = await apiResp.json();
      console.log(json);
      if (json.data != null) {
        setIsUserInAllowList(true);
        return true;
      }
      return false;
    }
  }

  const callMinAPI = async () => {
    let apiResp = await fetch(process.env.NEXT_PUBLIC_API_URL+"/mint", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // to: walletAddress,
        to: user?.wallet?.address,
        amount: quantity,
        id: 1,
        data: hash
      }),
    });
    const json = await apiResp.json();
    setMintData(json);
    console.log(apiResp.status);
    if (apiResp.status == 200) {
      setMintStatus("success");
      Swal.fire({
        title: json.message,
        text: json.transactionHash,
        icon: "success",
        confirmButtonText: "Read Comic Now"
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          router.push("/dashboard");
        }
      });;
    }
    // console.log(apiResp);
    // .then(response =>response.json());
  }
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (!isConfirmed) return;

    console.log({
      // to: walletAddress,
      to: user?.wallet?.address,
      amount: quantity,
      id: 1,
      data: hash
    });
    setMintStatus("minting");
    callMinAPI();

  }, [isConfirmed]);
  const [showDialog, setShowDialog] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setShowDialog(open);
  };
  const [showEmailLink, setShowEmailLink] = useState(false);
  const [showFareCasterLink, setShoFareCasterLink] = useState(false);
  useEffect(() => {
    if(ready && authenticated) {
      if(!user?.farcaster || !user?.email) {
        setShowDialog(true);
        if(!user?.farcaster) {
          setShoFareCasterLink(true);
        }
        if(!user?.email) {
          setShowEmailLink(true);
        }
      }
      console.log("User => ", user);
      console.log("Farcaster detail -> ", user?.farcaster);
      console.log("Email Detail -> ", user?.email);
      if (user?.email?.address) {
        checkIfInAllowList('Email').then((result) => {
            console.log("Email Allow List => ", result);
            if(result) {
              setIsUserInAllowList(true);
            }
          }
        );
      } else if (user?.farcaster?.fid) {
        checkIfInAllowList('Farcaster').then((result) => {
            console.log("Farcaster Allow List => ", result);
            if(result) {
              setIsUserInAllowList(true);
            }
          }
        );
      }
    }
  }, [ready, authenticated])

  useEffect(() => {
    if(ready && authenticated && localStorage.getItem('emailLink') == 'true') {
      localStorage.removeItem('emailLink');
      // check if user is in allow list
      checkIfInAllowList('Email').then((result) => {
        console.log("Email Allow List => ", result);
        if(result) {
          Swal.fire({
            title: 'Success',
            text: 'Your account is in the allow list.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  } , [user?.email]);

  useEffect(() => {
    if(ready && authenticated && localStorage.getItem('farcasterLink') == 'true') {
        localStorage.removeItem('farcasterLink');
        checkIfInAllowList('Farcaster').then((result) => {
          console.log("Farcaster Allow List => ", result);
          if(result) {
            Swal.fire({
              title: 'Success',
              text: 'Your account is in the allow list.',
              icon: 'info',
              confirmButtonText: 'OK'
            });
          }
        });
      }
  } , [user?.farcaster]);

  const handleCashPurchase = () => {
    const url = "https://shop.covenclassics.com/cart/48787580780834:" + quantity + (isUserInAllowList ? "?discount=FX3EJ9KNDTXG" : "");
    window.open(url, '_blank');
  }
  return (
    <div className="relative text-white  items-center py-2 px-8 lg:px-12">

      <main className="flex flex-col md:grid grid-cols-12 mt-8">
        <div className='md:col-span-5 lg:mr-10'>
          <Image
            src="/images/coven_classic.jpg"
            alt="Practical Magick"
            className="rounded-lg object-contain mt-4"
            width="500"
            height="700"
          />
        </div>
        <div className="px-4 lg:px-10 md:py-2 rounded-lg shadow-lg md:col-span-7">

          <h2 className="sm:block text-center lg:text-left text-[95px] pt-4 pb-8 leading-[5rem] bg-clip-text text-transparent bg-gradient-to-b from-[#ECECEC] to-[#2E2E2E] ">PRACTICAL MAGICK</h2>
          <div className='text-[24px] font-[Longevity] text-center lg:text-left'>
            <p className="mb-4 leading-10">
              Our first comic, 'Practical Magick,' brings to life gothic and witchy tales inspired by the cult classic 'The Craft.' It stars my iconic Sad Girls Bar characters as the main protagonists. The story follows two young witches who discover their magical abilities. As they delve deeper, they uncover dark secrets about their own lineage and the town's history.
            </p>
            <p className="mb-4 leading-10">
              This comic is a part of Coven Classics, a digital graphic novel series that reimagines classic stories with a fresh, dark-femme twist.
            </p>
          </div>
          {ready && authenticated &&
            <div className="flex h-14 items-center mb-4 font-[Longevity] border-[1px] rounded-md">
              <div className='w-[15%] text-right px-3 text-[40px] cursor-pointer' onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
                -
              </div>
              <div className='w-[70%]'>
                <input className='bg-[#181818] w-full rounded-lg focus:border-[#181818] text-center text-lg' placeholder='SELECT THE NUMBER OF COPIES YOU WANT TO MINT' name='qty' value={quantity} defaultValue={1} />
              </div>
              <div className='w-[15%] px-3 text-[40px] cursor-pointer' onClick={() => setQuantity(quantity + 1)}>
                +
              </div>

            </div>
          }
          <div className='text-[24px] font-[Longevity]'>
            {
              isUserInAllowList
              ?
              <p className="mb-4 leading-7">
                <del>
                  {baseAmount * quantity} ETH
                </del>
                <span className='pl-2'>
                  {(baseAmount/2) * quantity} ETH
                </span>
              </p>
              :
              <p className="mb-4 leading-7">
                {baseAmount * quantity} ETH
              </p>
            }
          </div>
          <p className="font-[ComicNeueLightItalic] text-base text-center lg:text-left text-white leading-5 mb-4">* If you purchase more than five digital comics, you will be eligible to claim and receive a physical copy of the comic by mail. Please allow us up to two months for shipping.</p>
          {ready &&
            <div className="flex space-x-7 md:space-x-8 lg:space-x-10  pt-4">
              {authenticated &&
                <>
                  <Pay_Button buttonText="PAY WITH CASH" onClick={handleCashPurchase} />
                  <Pay_Button buttonText={isPending ? 'Confirming...' : 'PAY WITH CRYPTO'} onClick={handleCryptoPurchase} isDisabled={isPending} />
                </>
              }
              {!authenticated &&
                <>
                  <Pay_Button buttonText="Login" onClick={login} />
                </>
              }
            </div>
          }
          {ready && authenticated &&
            <>
              <div className='mt-2 font-sans'>
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && mintStatus == "minting" && <div>Your NFT is Minting to your wallet...</div>}

                {error && (
                  <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                )}
              </div>
              {/* Full Screen Loader */}
              {
              isConfirming &&
              <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="bg-[#181818] text-white p-10 rounded-lg">
                  <Image src="/images/wait-sq.png" alt="logo" height="50" width="50" className="h-12 object-contain animate-spin m-auto" />
                  <h1 className="mt-8 text-2xl">Waiting for Confirmation...</h1>
                </div>
              </div>}
              {
                isConfirmed &&
                mintStatus == "minting" &&
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
                  <div className="bg-[#181818] text-white p-10 rounded-lg">
                    <Image src="/images/wait-sq.png" alt="logo" height="50" width="50" className="h-12 object-contain animate-spin m-auto" />
                    <h1 className="mt-8 text-2xl">Your NFT is Minting to your wallet...</h1>
                  </div>
                </div>
              }
            </>
          }
        </div>
        <Account_Link_Box isOpen={showDialog} onOpenChange={handleOpenChange} showEmailLink={showEmailLink} showFarecasterLink={showFareCasterLink} />
      </main>
    </div>
  );
}
