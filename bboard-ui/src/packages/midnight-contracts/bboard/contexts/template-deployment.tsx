import type { PropsWithChildren } from "react";
import React, { createContext } from "react";
import { type Logger } from "pino";

import type { DeployedTemplateAPIProvider } from "./template-deployment-class";
import { useTemplateLocalState } from "../hooks/use-localStorage";
import { DeployedTemplateManager } from "./template-deployment-class";

const TOKEN_ADDRESS = "4554545455454544545";

export const DeployedTemplateProviderContext = createContext<
  DeployedTemplateAPIProvider | undefined
>(undefined);

export type DeployedGameProviderProps = PropsWithChildren<{
  logger: Logger;
}>;

export const DeployedTemplateProvider = ({
  logger,
  children,
}: DeployedGameProviderProps) => {
  const localState = useTemplateLocalState();
  return (
    <DeployedTemplateProviderContext.Provider
      value={new DeployedTemplateManager(logger, localState, TOKEN_ADDRESS)}
    >
      {children}
    </DeployedTemplateProviderContext.Provider>
  );
};
