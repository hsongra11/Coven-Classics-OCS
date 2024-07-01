'use client';
import { usePrivy } from '@privy-io/react-auth';
import EmbeddedContent from '../_component/Embedded';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import Pay_Button from '../_component/Pay_Button';

export default function ShopifyReader() {
    const [isLoading, setIsLoading] = useState(false);
    const [isAllowed, setIsAllowed] = useState(false);
    const { ready, authenticated, user, login } = usePrivy();
    const showErrorAlert = function () {
        Swal.fire({
            icon: "error",
            title: "Sorry you don't own any NFTs yet!",
            text: "Buy one at covenclassics.com!",
            footer: 'Email <strong>rakshitaphillip1102@gmail.com</strong> if any issues',
        })
    }

    useEffect(() => {
        const checkUser = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/userlogin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: user?.email?.address,
                    })
                });
                const data = await response.json();
                if (data.data != null) {
                    setIsAllowed(true);
                } else {
                    showErrorAlert();
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }
        }

        if (user) {
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
                    <EmbeddedContent />
                </div>
            }
            {
                ready && !authenticated &&
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-[#181818] text-white p-10 rounded-lg">
                        <h1 className="text-2xl">Please login to view the content</h1>
                        <Pay_Button buttonText="Login" onClick={login} />
                    </div>
                </div>
            }
        </>
    )
}