'use client'
import { usePrivy } from "@privy-io/react-auth";
import { redirect } from 'next/navigation'
import { useEffect } from "react";

export default function Login() {
  const {
    login,
    ready,
    authenticated,
    user,
    logout } = usePrivy();
  useEffect(() => {
    if (ready && authenticated) {
      redirect("/dashboard");
    }
  }, [ready, authenticated]);

  return (
    <main className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
      </div>
      <div className="p-5 pt-8 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Click on login to continue with ur account
            </p>
          </div>
          <div className="grid gap-6">

            <button
              className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg"
              onClick={login}
            >
              Log in
            </button>
            {ready && authenticated &&
              <>
                <button className="bg-red-500 hover:bg-red-200 py-3 px-6 text-white rounded-lg" onClick={logout}>Log Out</button>
              </>
            }

          </div>
        </div>
      </div>
    </main>
  );
}
