'use client';

import { MidnightMeshProvider } from '@/packages/midnight-react';
import React, { useEffect, useState } from 'react';
import { setNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as pino from 'pino';
import { DeployedTemplateProvider, BboardLocalStorageProvider, TemplateProvider } from '@/packages/midnight-contracts';
import { DAppConnectorWalletAPI, ServiceUriConfig } from '@midnight-ntwrk/dapp-connector-api';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';

interface MidnightLayoutProps {
  children: React.ReactNode;
}

const networkId = 'TestNet' as NetworkId;
// const networkId = "TestNet" as NetworkId;
setNetworkId(networkId);

export const logger = pino.pino({
  level: 'trace',
});

const MidnightLayout = ({ children }: MidnightLayoutProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

   if (!isClient) return <div>Loading...</div>;

  return (
    <MidnightMeshProvider logger={logger}>
      <BboardLocalStorageProvider logger={logger}>
        <DeployedTemplateProvider logger={logger}>
          <TemplateProvider logger={logger}>{children}</TemplateProvider>
        </DeployedTemplateProvider>
      </BboardLocalStorageProvider>
    </MidnightMeshProvider>
  );
};

export default MidnightLayout;
