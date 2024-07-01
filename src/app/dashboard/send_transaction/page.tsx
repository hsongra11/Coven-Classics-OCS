'use client';

import React from 'react';
import {
  type BaseError,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseEther } from 'viem';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormData {
  address: string;
  value: string;
}

const SendTransaction: React.FC = () => {
  const form = useForm<FormData>({
    defaultValues: {
      address: '0xA15AB58B46ABc6FeEA2b75F19826e987c9D60090',
      value: '0.0001',
    },
  });

  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction();

  const submit: SubmitHandler<FormData> = (values) => {
    const { address, value } = values;
    sendTransaction({ to: address as `0x${string}`, value: parseEther(value) });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="p-1 lg:p-8 flex justify-center items-center h-screen">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(submit)} className='space-y-4'>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="0xA0Cf…251e" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="0.05" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button  disabled={isPending} type="submit">
            {isPending ? 'Confirming...' : 'Send'}
          </Button>
          {hash && <div>Transaction Hash: {hash}</div>}
          {isConfirming && <div>Waiting for confirmation...</div>}
          {isConfirmed && <div>Transaction confirmed.</div>}
          {error && (
            <div>Error: {(error as BaseError).shortMessage || error.message}</div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default SendTransaction;
