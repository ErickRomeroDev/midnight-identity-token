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
const TOKEN_ADDRESS = "02002ac4f00ee535ebd851d2eb3b4a1e038a0aa3353ff93e6e61da276327ff0333a9" as ContractAddress;

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
