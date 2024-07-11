'use client';
import { usePrivy } from '@privy-io/react-auth';
import EmbeddedContent from '../_component/Embedded';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import Pay_Button from '../_component/Pay_Button';
import FlipBook from '../_component/FlipBook';
import Link from 'next/link';

export default function ShopifyReader() {
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);
    const { ready, authenticated, user, login, logout } = usePrivy();
    const [mintStatus, setMintStatus] = useState<string>("pending");
    const [mintData, setMintData] = useState(null); // [to,amount,id,data]
    const showErrorAlert = function () {
        Swal.fire({
            icon: "error",
            title: "Sorry you don't own any NFTs yet!",
            text: "Buy one at covenclassics.com!",
            footer: 'Email <strong>rakshitaphillip1102@gmail.com</strong> if any issues',
        })
    }

    // API Route: /login
    const getAccessToken = async (user: any) => {
        try {
            //Auth hidden
                }),
            });
            const data = await response.json();
            // console.log(data);
            return data;
        } catch (error) {
            // console.log(error)
            logout()
        }
    }

    useEffect(() => {
        if (isInitialLoad) return;
        if (ready && authenticated) {
            user ? getAccessToken(user) : null;
        }
    }, [ready, authenticated])

    const callMinAPI = async (email_address: any, quantity: any, hash: any, shopify_id: any) => {
        let apiResp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/mint", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $bearer || ''
            },
            body: JSON.stringify({
                // to: walletAddress,
                email: email_address,
                farcaster_id: user?.farcaster?.fid,
                to: user?.wallet?.address,
                amount: quantity,
                id: 1,
                data: hash,
                isShopifyOrder: true,
                shopify_id: shopify_id,
            }),
        });
        const json = await apiResp.json();
        setMintData(json);
        // console.log(apiResp.status);
        if (apiResp.status == 200) {
            setMintStatus("success");
        }
        // console.log(apiResp);
        // .then(response =>response.json());
    }

    const toBytes32 = (str: any) => {
        // Convert string to a hexadecimal representation
        let hexStr = Buffer.from(str, 'utf8').toString('hex');

        // Ensure the hex string is 32 bytes (64 hex characters) long
        if (hexStr.length < 64) {
            hexStr = hexStr.padEnd(64, '0'); // Pad with zeros if too short
        } else if (hexStr.length > 64) {
            hexStr = hexStr.substring(0, 64); // Truncate if too long
        }

        // Convert hex string to bytes32 format
        const bytes32 = '0x' + hexStr;
        return bytes32;
    }

    useEffect(() => {
        const checkUser = async () => {
            try {
                setIsLoading(true);
                //call user login & calls the mint api for the user's backend drop
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/userlogin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + $bearerToken || '',
                    },
                    body: JSON.stringify({
                        email: user?.email?.address || user?.google?.email,
                    })
                });
                const data = await response.json();
                if (data.data != null) {
                    setIsAllowed(true);
                    if (!data?.data?.is_minted) {
                        // // callMinAPI(data?.data?.email_address, data?.data?.purchase_qty, toBytes32(data?.data?.order_id))
                        if (!(window as any).isMinted) {
                            (window as any).isMinted = true;
                            callMinAPI(data?.data?.email_address, data?.data?.purchase_qty, tx + data?.data?.id, data?.data?.id);
                        }
                    }
                } else {
                    // showErrorAlert();
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }
        }

        user ? getAccessToken(user) : null;

        if (user) {
            // console.log(user);
            checkUser();
        }
    }, [user]);

    return (
        <>
            {isLoading &&
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-[#181818] text-white p-10 rounded-lg">
                        <Image src="/images/wait-sq.png" alt="logo" height="50" width="50" className="h-12 object-contain animate-spin m-auto" />
                        <h1 className="mt-8 text-2xl">Loading...</h1>
                    </div>
                </div>
            }
            {!isLoading && isAllowed && ready && authenticated &&
                <div>
                    {/* <EmbeddedContent /> */}
                    <FlipBook />
                </div>
            }
            {!isLoading && !isAllowed && ready && authenticated &&
                <div>
                    {/* <EmbeddedContent /> */}
                    <FlipBook />
                    <div className='text-center text-white'>
                        <p className='text-[24px] font-[ComicNeueLightItalic]'>
                            <Link href="https://comic.covenclassics.com" prefetch={false} className='text-white'>
                                Buy Now! to read the full comic.
                            </Link>
                        </p>
                    </div>
                </div>
            }
            {
                ready && !authenticated &&
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-[#181818] text-white p-10 rounded-lg text-center">
                        <h1 className="text-2xl">Please login to view the content</h1>
                        <div className='flex items-center justify-center mt-4'>
                            <Pay_Button buttonText="LOGIN" onClick={login} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
