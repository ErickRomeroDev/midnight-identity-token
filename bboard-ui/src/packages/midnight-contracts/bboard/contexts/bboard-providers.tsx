import type { CoinInfo, TransactionId } from '@midnight-ntwrk/ledger';
import type {
  BalancedTransaction,
  PrivateStateProvider,
  UnbalancedTransaction,
  WalletProvider,
} from '@midnight-ntwrk/midnight-js-types';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import {
  MidnightProvider,
  ProofProvider,
  PublicDataProvider,
  ZKConfigProvider,
  createBalancedTx,
} from '@midnight-ntwrk/midnight-js-types';
import { Logger } from 'pino';
import type { CircuitKeys } from '@meshsdk/bboard-api';
import {
  CachedFetchZkConfigProvider,
  noopProofClient,
  proofClient,
  WrappedPrivateStateProvider,
  WrappedPublicDataProvider,
} from '@/packages/midnight-core/providers-wrappers';
import { PrivateStates, Providers } from '@meshsdk/bboard-api';
import { Transaction as ZswapTransaction } from '@midnight-ntwrk/zswap';
import { getLedgerNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { Transaction } from '@midnight-ntwrk/ledger';
import { ProviderCallbackAction } from '@/packages/midnight-core';
import { useAssets, useWallet } from '@/packages/midnight-react';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import WebSocket from 'isomorphic-ws';
import { DAppConnectorWalletAPI, ServiceUriConfig } from '@midnight-ntwrk/dapp-connector-api';
import { pipe } from 'fp-ts/function';

export interface TemplateProvidersState {
  privateStateProvider: PrivateStateProvider<PrivateStates>;
  zkConfigProvider: ZKConfigProvider<CircuitKeys>;
  proofProvider: ProofProvider<CircuitKeys>;
  publicDataProvider?: PublicDataProvider;
  walletProvider?: WalletProvider;
  midnightProvider?: MidnightProvider;
  providers?: Providers;
  snackBarText?: string;
}

interface TemplateAppProviderProps {
  children: React.ReactNode;
  logger: Logger;
}

export const TemplateProvidersContext = createContext<TemplateProvidersState | undefined>(undefined);

export const TemplateProvider = ({ children, logger }: TemplateAppProviderProps) => {
  const [providers, setProviders] = useState<TemplateProvidersState | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [snackBarText, setSnackBarText] = useState<string | undefined>(undefined);

  const { uris, coinPublicKey } = useAssets();
  const { midnightBrowserWalletInstance } = useWallet();

  const providerCallback: (action: ProviderCallbackAction) => void = (action: ProviderCallbackAction): void => {
    if (action === 'proveTxStarted') {
      setSnackBarText('Proving transaction...');
    } else if (action === 'proveTxDone') {
      setSnackBarText(undefined);
    } else if (action === 'balanceTxStarted') {
      setSnackBarText('Signing the transaction with Midnight Lace wallet...');
    } else if (action === 'downloadProverDone') {
      setSnackBarText(undefined);
    } else if (action === 'downloadProverStarted') {
      setSnackBarText('Downloading prover key...');
    } else if (action === 'balanceTxDone') {
      setSnackBarText(undefined);
    } else if (action === 'submitTxStarted') {
      setSnackBarText('Submitting transaction...');
    } else if (action === 'submitTxDone') {
      setSnackBarText(undefined);
    } else if (action === 'watchForTxDataStarted') {
      setSnackBarText('Waiting for transaction finalization on blockchain...');
    } else if (action === 'watchForTxDataDone') {
      setSnackBarText(undefined);
    }
  };

  const privateStateProvider: PrivateStateProvider<PrivateStates> = useMemo(
    () =>
      new WrappedPrivateStateProvider(
        levelPrivateStateProvider({
          privateStateStoreName: 'battleship-private-state',
        }),
        logger,
      ),
    [logger],
  );

  const zkConfigProvider = useMemo(() => {
    if (typeof window === "undefined") {
      return undefined; // ✅ Avoid using `window` during SSR
    }
    return new CachedFetchZkConfigProvider<CircuitKeys>(
      `${window.location.origin}/midnight/bboard`,
      fetch.bind(window),
      () => {},
    );
  }, []);

const publicDataProvider = useMemo(() => {
  if (typeof window === "undefined" || !uris?.indexerUri || !uris?.indexerWsUri) {
    return undefined; // ✅ Prevent execution during SSR
  }
  
  // return new WrappedPublicDataProvider(
  //   indexerPublicDataProvider(uris.indexerUri, uris.indexerWsUri),
  //   providerCallback,
  //   logger,
  // );
}, [uris, logger, providerCallback]);


  return (
    <TemplateProvidersContext.Provider value={providers}>
      {isLoading ? <div>Loading Providers...</div> : children}
    </TemplateProvidersContext.Provider>
  );
};

