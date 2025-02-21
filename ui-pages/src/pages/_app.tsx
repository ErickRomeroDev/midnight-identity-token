import type { AppProps } from 'next/app';
import { MidnightMeshProvider } from '@/packages/midnight-react';
import { setNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as pino from 'pino';
// import { AppProvider as BboardAppProvider  } from '@/packages/midnight-contracts/bboard';
import { AppProvider as TokenAppProvider } from '@/packages/midnight-contracts/token';
import { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import '@meshsdk/react/styles.css';
import { MeshProvider } from '@meshsdk/react';

// const networkId = 'TestNet' as NetworkId;
const networkId = 'Undeployed' as NetworkId;
setNetworkId(networkId);
const TOKEN_ADDRESS = '0200f66dc09afc456b344cf87f954b9dce319dffd6890c836cf1fc688566e4963903' as ContractAddress;

export const logger = pino.pino({
  level: 'trace',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <MidnightMeshProvider logger={logger}>
        <TokenAppProvider logger={logger} TOKEN_ADDRESS={TOKEN_ADDRESS}>
          <Component {...pageProps} />
        </TokenAppProvider>
      </MidnightMeshProvider>
    </MeshProvider>
  );
}
