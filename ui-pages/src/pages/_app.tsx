import type { AppProps } from 'next/app';
import { MidnightMeshProvider } from '@/packages/midnight-react';
import { setNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as pino from 'pino';
// import { AppProvider as BboardAppProvider  } from '@/packages/midnight-contracts/bboard';
import { AppProvider as TokenAppProvider } from '@/packages/midnight-contracts/token';
import { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import '@/styles/globals.css';
import { EB_Garamond, IBM_Plex_Sans } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner"
import { Header } from '@/modules/home/components/header';
import { api } from '@/utils/api';

// const networkId = 'TestNet' as NetworkId;
const networkId = 'Undeployed' as NetworkId;
setNetworkId(networkId);
const TOKEN_ADDRESS = '020042d2eaa3b8e629c73f6fb8ddb7440ffbc24c156d4ba78428bacbe2855a491da5' as ContractAddress;

export const logger = pino.pino({
  level: 'trace',
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <MidnightMeshProvider logger={logger}>
      <TokenAppProvider logger={logger} TOKEN_ADDRESS={TOKEN_ADDRESS}>
        <div className={`${ibmPlexSans.variable} ${ebGaramond.variable} font-[family-name:var(--font-ibm-plex-sans)]`}>
          <Header />
          <Toaster />
          <Component {...pageProps} />
        </div>
      </TokenAppProvider>
    </MidnightMeshProvider>
  );
};

export default api.withTRPC(MyApp);
