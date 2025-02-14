import type { AppProps } from 'next/app';
import { MidnightMeshProvider } from '@/packages/midnight-react';
import { setNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as pino from 'pino';
import { AppProvider } from '@/packages/midnight-contracts';
import { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import '@/styles/globals.css';

// const networkId = 'TestNet' as NetworkId;
const networkId = 'Undeployed' as NetworkId;
setNetworkId(networkId);
const TOKEN_ADDRESS = "02000321c880b269d38d2cf9aaa8c78a87eb982e433c35b9fb0ecea240eb5a85c534" as ContractAddress;

export const logger = pino.pino({
  level: 'trace',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MidnightMeshProvider logger={logger}>
      <AppProvider logger={logger} TOKEN_ADDRESS={TOKEN_ADDRESS}>
        <Component {...pageProps} />
      </AppProvider>
    </MidnightMeshProvider>
  );
}
