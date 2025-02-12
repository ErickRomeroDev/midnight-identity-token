import { useContext } from 'react';
import { TemplateProvidersContext, TemplateProvidersState } from '../contexts';

export const useTemplateProviders = (): TemplateProvidersState | null => {
  const templateProviderState = useContext(TemplateProvidersContext);
  if (!templateProviderState) {
    console.warn('[useTemplateProviders] Providers not ready yet.');
    return null;
  }
  return templateProviderState;
};
