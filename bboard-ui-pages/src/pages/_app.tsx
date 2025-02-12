import type { AppProps } from 'next/app';
import { MidnightMeshProvider } from '@/packages/midnight-react';
import { setNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as pino from 'pino';
import { BboardLocalStorageProvider } from '@/packages/midnight-contracts/bboard/contexts/bboard-localStorage';
import { Provider } from '@/packages/midnight-contracts/bboard/contexts/bboard-providers';
import '@/styles/globals.css';
import { DeployedProvider } from '@/packages/midnight-contracts';

const networkId = 'TestNet' as NetworkId;
// const networkId = "TestNet" as NetworkId;
setNetworkId(networkId);

export const logger = pino.pino({
  level: 'trace',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MidnightMeshProvider logger={logger}>
      <BboardLocalStorageProvider logger={logger}>
        <Provider logger={logger}>
          <DeployedProvider logger={logger}>
            <Component {...pageProps} />
          </DeployedProvider>
        </Provider>
      </BboardLocalStorageProvider>
    </MidnightMeshProvider>
  );
}
