'use client';
import Link from "next/link"
import Image from "next/image"
import Navbar_Link from "./Navbar_Link"
import Pay_Button from './Pay_Button'
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from 'next/navigation'

export default function Navbar() {

  const router = useRouter();

  const { ready, authenticated, logout } = usePrivy();

  const redirectToDashboard = () => {
    router.push("/dashboard");
  }

  return (
    <nav className="relative inset-x-0 top-0 z-50 shadow-sm bg-[#181818]" >
      <div className="w-full mx-auto px-8 sm:px-14 py-6">
        <div className="flex justify-between items-center">
          <Link href="#" className="flex items-center" prefetch={false}>
          {/* different for mobile and desktop */}
            <Image src="/images/logo_sq.png" alt="logo" height="40" width="200" className='w-5/6 h-12 object-contain md:hidden' />
            <Image src="/images/logo.png" alt="logo" height="40" width="200" className='w-5/6 h-12 object-contain hidden md:block' />
          </Link>
          <nav className="hidden sm:flex gap-6 sm:gap-10 md:gap-16 text-white text-[32px]">
            <Navbar_Link link_name="HOME" link="#" />
            <Navbar_Link link_name="ABOUT" link="#" />
            <Navbar_Link link_name="TEAM" link="#" />
            <Navbar_Link link_name="ROADMAP" link="#" />
            <Navbar_Link link_name="FAQ" link="#" />
            <Navbar_Link link_name="Read Comic" link="/dashboard" />
          </nav>
          { ready && authenticated &&
          // hide on desktop and show on mobile
            <div className='flex items-center gap-4 md:hidden'>
              <button onClick={logout} className='font-[Carola] hover:underline text-white text-[22px]'>Logout</button>
            </div>
          }
          <div className="hidden md:flex items-center gap-4">
            { ready && authenticated &&
              // <Pay_Button buttonText="Logout" onClick={logout} />
              <button onClick={logout} className='font-[Carola] hover:underline text-white text-[32px]'>Logout</button>
            }
            {/* <Image src="/images/wait.png" alt="logo" height="50" width="50" className="w-5/6 h-12 object-contain" /> */}
          </div>
        </div>
      </div>
    </nav>
  )
}