import { useContext } from 'react';
import { DeployedProviderContext, type DeployedAPIProvider } from '../contexts';

export const useDeployedGameContext = (): DeployedAPIProvider => {
  const context = useContext(DeployedProviderContext);

  if (!context) {
    throw new Error('A <DeployedGameProvider /> is required.');
  }

  return context;
};
