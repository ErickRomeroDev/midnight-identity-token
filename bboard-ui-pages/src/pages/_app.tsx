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
const TOKEN_ADDRESS = "0200d5f88ebe845825f464813d84995acbb622ccb8ec97f80f99a4d929ac51adc730" as ContractAddress;

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
