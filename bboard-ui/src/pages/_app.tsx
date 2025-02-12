import type { AppProps } from 'next/app';
import { MidnightMeshProvider } from '@/packages/midnight-react';
import { setNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as pino from 'pino';
import { BboardLocalStorageProvider } from '@/packages/midnight-contracts/bboard/contexts/bboard-localStorage';
import { TemplateProvider } from '@/packages/midnight-contracts/bboard/contexts/bboard-providers';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';


const networkId = 'TestNet' as NetworkId;
// const networkId = "TestNet" as NetworkId;
setNetworkId(networkId);

export const logger = pino.pino({
  level: 'trace',
});

export default function App({ Component, pageProps }: AppProps) {
  // indexerPublicDataProvider("https://indexer.testnet.midnight.network/api/v1/graphql", "wss://indexer.testnet.midnight.network/api/v1/graphql/ws")
  return (
    <MidnightMeshProvider logger={logger}>
      <BboardLocalStorageProvider logger={logger}>
        {/* <DeployedTemplateProvider logger={logger}> */}
        <TemplateProvider logger={logger}>
          <Component {...pageProps} />
        </TemplateProvider>
        {/* </DeployedTemplateProvider> */}
        {/* {children} */}
      </BboardLocalStorageProvider>
    </MidnightMeshProvider>
  );
}
