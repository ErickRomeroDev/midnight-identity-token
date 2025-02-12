import type { PropsWithChildren } from 'react';
import React, { createContext } from 'react';
import { type Logger } from 'pino';

import type { DeployedAPIProvider } from './bboard-deployment-class';
import { useLocalState } from '../hooks/use-localStorage';
import { DeployedTemplateManager } from './bboard-deployment-class';

const TOKEN_ADDRESS = '4554545455454544545';

export const DeployedProviderContext = createContext<DeployedAPIProvider | undefined>(undefined);

export type DeployedGameProviderProps = PropsWithChildren<{
  logger: Logger;
}>;

export const DeployedProvider = ({ logger, children }: DeployedGameProviderProps) => {
  const localState = useLocalState();
  return (
    <DeployedProviderContext.Provider value={new DeployedTemplateManager(logger, localState, TOKEN_ADDRESS)}>
      {children}
    </DeployedProviderContext.Provider>
  );
};
