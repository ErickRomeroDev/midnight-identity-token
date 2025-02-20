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
const TOKEN_ADDRESS = "0200cad7d076b1104dba3aa0f8c8869e288f23bb5435b1149a0594674b9b19075980" as ContractAddress;

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
