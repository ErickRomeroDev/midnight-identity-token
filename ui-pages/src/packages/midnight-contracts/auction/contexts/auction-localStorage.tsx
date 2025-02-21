import React, { createContext } from 'react';
import { type Logger } from 'pino';
import { LocalStorage, LocalStorageProps } from './auction-localStorage-class';

export const LocalStorageContext = createContext<LocalStorageProps | undefined>(undefined);

export interface LocalStorageProviderProps {
  children: React.ReactNode;
  logger: Logger;
}

export const LocalStorageProvider = ({ children, logger }: LocalStorageProviderProps) => {
  return <LocalStorageContext.Provider value={new LocalStorage(logger)}>{children}</LocalStorageContext.Provider>;
};
