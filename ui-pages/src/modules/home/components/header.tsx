import Image from 'next/image';
import Link from 'next/link';
import { CardanoWallet } from '@/packages/midnight-react';
import { useSubscriptions } from '@/packages/midnight-contracts/token/hooks/use-subscriptions';
import { toast } from 'sonner';
import { useProviders } from '@/packages/midnight-contracts/token';
import { useEffect } from 'react';

export const Header = () => {
  const providers = useProviders();
  const { deployedAPI, derivedState } = useSubscriptions();

  const mint = () => {
    if (deployedAPI) {
      deployedAPI.mint();
    }
  };

  useEffect(() => {
    toast.dismiss(); // Remove previous messages
    if (derivedState?.userAction?.action === 'minting') {
      toast.info('minting');      
    }
    if (derivedState?.userAction?.action === 'minting-done') {
      toast.info('minting-done');      
    }
  }, [derivedState]);

  useEffect(() => {
    if (providers?.flowMessage) {
      toast.dismiss(); // Remove previous messages
      toast.info(providers.flowMessage, {
        id: 'flowMessageToast',  // Use a fixed ID to avoid duplicates
        duration: Infinity,
      });
    }
  }, [providers?.flowMessage]);

  return (
    <div className="inset-0 fixed z-50 flex items-center justify-between h-[70px] px-12 bg-[#FAFAFA]">
      <Link href="/">
        <div className=" flex items-center gap-x-3">
          <Image src="/sample-logo.svg" alt="Midnight Auctions" width={26} height={26} />
          <h1 className="w-[100px] leading-[1.15] text-sm text-[#0E1B2E] text-wrap font-[family-name:var(--font-eb-garamond)]">
            MIDNIGHT AUCTIONS
          </h1>
        </div>
      </Link>

      <nav className="relative h-full flex items-center gap-x-10 text-[18px] text-[#0E1B2E]">
        <div className="absolute top-[22px] right-[150px] rounded-full h-[25px] w-[1.2px] bg-[#0E1B2E]" />
        <Link href="/">
          <button className="hover:text-[#D28C13]">Home</button>
        </Link>
        <Link href="/auctions">
          <button className="hover:text-[#D28C13]">Auctions</button>
        </Link>

        <button onClick={mint} className="hover:text-[#D28C13]">
          Mint tBID
        </button>

        <Link href="/">
          <button className="hover:text-[#D28C13]">Documentation</button>
        </Link>
        <CardanoWallet />
      </nav>
    </div>
  );
};
