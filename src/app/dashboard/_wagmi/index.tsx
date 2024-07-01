import { useReadContract, useAccount } from 'wagmi'
//import { abi } from './optimismAbi';
import { abi } from './baseAbi';
import Big from 'big.js'; // Import big.js
import PdfViewer from '../_component/PdfViewer';
import Swal from 'sweetalert2';
import EmbeddedContent from '@/app/_component/Embedded';

export const ReadContract = () => {
  const { address } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_BASE_CONTRACT_ID as `0x${string}` | undefined;

  const { data, isError, isLoading } = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'balanceOf',
    args: address ? [address, BigInt(1)] : undefined,
  });

  const showErrorAlert=function()
  {
    Swal.fire({
      icon: "error",
      title: "Sorry you don't own any NFTs yet!",
      text: "Buy one at covenclassics.com!",
      footer: 'Email <strong>rakshitaphillip1102@gmail.com</strong> if any issues',
    })
  }

  let balance;
  if (data) {
    balance = new Big(data.toString()).toString();
  }


  if (isLoading) return <div>Loading... </div>;
  if (isError) return <div>Error loading balance </div>;
if(!balance)
  {
    showErrorAlert()
  }
  return (
    <>
      <div>
        <p>{balance ? <><div className="pt-8">

        <EmbeddedContent />
      </div>


      </> : ''}
      </p>
      </div>
      </>
  );
};