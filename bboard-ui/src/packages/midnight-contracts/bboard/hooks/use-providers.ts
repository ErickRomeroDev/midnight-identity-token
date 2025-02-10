import { useContext } from "react";
import { TemplateProvidersContext, TemplateProvidersState } from "../contexts";

export const useTemplateProviders = (): TemplateProvidersState => {
    const templateProviderState = useContext(TemplateProvidersContext);
    if (!templateProviderState) {
      throw new Error('Template contract providers not loaded');
    }
    return templateProviderState;
  };