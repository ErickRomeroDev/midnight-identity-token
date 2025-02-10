import { useContext } from 'react';
import { DeployedTemplateProviderContext, type DeployedTemplateAPIProvider } from '../contexts';

export const useDeployedGameContext = (): DeployedTemplateAPIProvider => {
  const context = useContext(DeployedTemplateProviderContext);

  if (!context) {
    throw new Error('A <DeployedGameProvider /> is required.');
  }

  return context;
};
