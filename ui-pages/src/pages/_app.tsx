import type { AppProps } from 'next/app';
import { MidnightMeshProvider } from '@/packages/midnight-react';
import { setNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as pino from 'pino';
// import { AppProvider as BboardAppProvider  } from '@/packages/midnight-contracts/bboard';
import { AppProvider as TokenAppProvider  } from '@/packages/midnight-contracts/token';
import { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import '@/styles/globals.css';

// const networkId = 'TestNet' as NetworkId;
const networkId = 'Undeployed' as NetworkId;
setNetworkId(networkId);
const TOKEN_ADDRESS = "02007f7ddeae78a255f983040c595fed9b5639e81b2bf8596fe8f6b11dc0c257415f" as ContractAddress;

export const logger = pino.pino({
  level: 'trace',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MidnightMeshProvider logger={logger}>
      <TokenAppProvider logger={logger} TOKEN_ADDRESS={TOKEN_ADDRESS}>
        <Component {...pageProps} />
      </TokenAppProvider>
    </MidnightMeshProvider>
  );
}
