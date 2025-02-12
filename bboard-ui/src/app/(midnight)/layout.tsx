'use client';

import { MidnightMeshProvider } from '@/packages/midnight-react';
import React, { useEffect, useState } from 'react';
import { setNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as pino from 'pino';

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
    <div>
      <MidnightMeshProvider logger={logger}>{children}</MidnightMeshProvider>
    </div>
  );
};

export default MidnightLayout;
