'use client';

import React, { useEffect, useState } from 'react';
import { MidnightMeshProvider } from '@/packages/midnight-react';
import { setNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as pino from 'pino';
import { AppProvider } from '@/packages/midnight-contracts';
import { ContractAddress } from '@midnight-ntwrk/compact-runtime';

interface MidnightLayoutProps {
  children: React.ReactNode;
}

// globalThis.WebSocket = WebSocket;
// const networkId = 'TestNet' as NetworkId;
const networkId = 'Undeployed' as NetworkId;
setNetworkId(networkId);
const TOKEN_ADDRESS = 'dffdffd' as ContractAddress;

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
    <div>
      <MidnightMeshProvider logger={logger}>
        <AppProvider logger={logger} TOKEN_ADDRESS={TOKEN_ADDRESS}>
          {children}
        </AppProvider>
      </MidnightMeshProvider>
    </div>
  );
};

export default MidnightLayout;
