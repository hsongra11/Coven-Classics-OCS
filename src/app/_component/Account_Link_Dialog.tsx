/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

interface DialogProps {
  showEmailLink?: boolean,
  showFarecasterLink?: boolean,
  isOpen: boolean,
  onOpenChange: (isOpen: boolean) => void;
}

export function Account_Link_Box({ isOpen, onOpenChange, showEmailLink, showFarecasterLink }: DialogProps) {
  const {
    ready,
    authenticated,
    user,
    linkFarcaster,
    linkEmail,
  } = usePrivy();

  const handleLinkEmail = () => {
    // set the email is being linked flag to true
    localStorage.setItem('emailLink', 'true');
    linkEmail();
  }

  const handleLinkFarcaster = () => {
    // set the Farcaster is being linked flag to false
    localStorage.setItem('farcasterLink', 'false');
    linkFarcaster();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#343434] text-white border-0">
        <DialogHeader>
          <DialogTitle className='font-[Carola] text-2xl'>Link Account</DialogTitle>
          <DialogDescription className='font-[Longevity] text-white text-2xl'>
            Are you a part of Allow List?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='font-[Longevity]'>
          {showEmailLink &&
            <Button className='bg-black mb-2 text-xl' onClick={handleLinkEmail}>Sign in with Email</Button>
          }
          {showFarecasterLink &&
            <Button className='bg-black mb-2 text-xl' onClick={handleLinkFarcaster}>Sign in With Farcaster</Button>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
