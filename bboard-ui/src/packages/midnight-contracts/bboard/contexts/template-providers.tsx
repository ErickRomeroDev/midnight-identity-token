import type { CoinInfo, TransactionId } from '@midnight-ntwrk/ledger';
import type {
  BalancedTransaction,
  PrivateStateProvider,
  UnbalancedTransaction,
  WalletProvider,
} from '@midnight-ntwrk/midnight-js-types';
import { createContext, useEffect, useMemo, useState } from 'react';
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

import {  type CoinPublicKey } from '@midnight-ntwrk/wallet-api';
import type { DAppConnectorWalletAPI, ServiceUriConfig } from '@midnight-ntwrk/dapp-connector-api';

export interface TemplateProvidersState {
  privateStateProvider: PrivateStateProvider<PrivateStates>;
  zkConfigProvider: ZKConfigProvider<CircuitKeys>;
  proofProvider: ProofProvider<CircuitKeys>;
  publicDataProvider: PublicDataProvider;
  walletProvider: WalletProvider;
  midnightProvider: MidnightProvider;
  providers: Providers;
  callback: (action: ProviderCallbackAction) => void;
}

interface TemplateAppProviderProps {
  children: React.ReactNode;
  logger: Logger;
}

export interface WalletAPI {
  wallet: DAppConnectorWalletAPI;
  coinPublicKey: CoinPublicKey;
  uris: ServiceUriConfig;
}

export const TemplateProvidersContext = createContext<TemplateProvidersState | null>(null);

export const TemplateProvider = ({ children, logger }: TemplateAppProviderProps) => { 
  const [snackBarText, setSnackBarText] = useState<string | undefined>(undefined); 
  const [walletAPI, setWalletAPI] = useState<WalletAPI | undefined>(undefined);
  

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
          privateStateStoreName: 'template-private-state',
        }),
        logger,
      ),
    [logger],
  );

  const publicDataProvider = useMemo(() => {   
    if (walletAPI) {
      new WrappedPublicDataProvider(indexerPublicDataProvider(walletAPI.uris.indexerUri, walletAPI.uris.indexerWsUri), providerCallback, logger);
      
    }     
  }, [logger, walletAPI]);

  const zkConfigProvider = useMemo(
    () =>
      new CachedFetchZkConfigProvider<CircuitKeys>(`${window.location.origin}/template`, fetch.bind(window), providerCallback),
    [],
  );

  

  const proofProvider = useMemo(() => {
    if (walletAPI) {
      return proofClient(walletAPI.uris.proverServerUri, providerCallback);
    } else {
      return noopProofClient();
    }
  }, [walletAPI]);

  const walletProvider: WalletProvider = useMemo(() => {
    if (walletAPI) {
      return {
        coinPublicKey: walletAPI.coinPublicKey,
        balanceTx(tx: UnbalancedTransaction, newCoins: CoinInfo[]): Promise<BalancedTransaction> {
          providerCallback('balanceTxStarted');
          return walletAPI.wallet
            .balanceAndProveTransaction(
              ZswapTransaction.deserialize(tx.serialize(getLedgerNetworkId()), getZswapNetworkId()),
              newCoins,
            )
            .then((zswapTx) => Transaction.deserialize(zswapTx.serialize(getZswapNetworkId()), getLedgerNetworkId()))
            .then(createBalancedTx)
            .finally(() => {
              providerCallback('balanceTxDone');
            });
        },
      };
    } else {
      return {
        coinPublicKey: '',
        balanceTx(tx: UnbalancedTransaction, newCoins: CoinInfo[]): Promise<BalancedTransaction> {
          return Promise.reject(new Error('readonly'));
        },
      };
    }
  }, [walletAPI]);

  const midnightProvider: MidnightProvider = useMemo(() => {
    if (walletAPI) {
      return {
        submitTx(tx: BalancedTransaction): Promise<TransactionId> {
          providerCallback('submitTxStarted');
          return walletAPI.wallet.submitTransaction(tx).finally(() => {
            providerCallback('submitTxDone');
          });
        },
      };
    } else {
      return {
        submitTx(tx: BalancedTransaction): Promise<TransactionId> {
          return Promise.reject(new Error('readonly'));
        },
      };
    }
  }, [walletAPI]);

  const [providerState, setProviderState] = useState<TemplateProvidersState>({      
      privateStateProvider,
      zkConfigProvider,
      proofProvider,
      publicDataProvider,
      walletProvider,
      midnightProvider,    
      providers: {
        privateStateProvider,
        publicDataProvider,
        zkConfigProvider,
        proofProvider,
        walletProvider,
        midnightProvider,
      },
      callback: providerCallback,
    });

    useEffect(() => {
      setProviderState((state) => ({
        ...state,        
        privateStateProvider,
        zkConfigProvider,
        proofProvider,
        publicDataProvider,
        walletProvider,
        midnightProvider,
        providers: {
          privateStateProvider,
          publicDataProvider,
          zkConfigProvider,
          proofProvider,
          walletProvider,
          midnightProvider,
        },
      }));
    }, [
      walletAPI,
      privateStateProvider,
      zkConfigProvider,
      proofProvider,
      publicDataProvider,
      walletProvider,
      midnightProvider,
    ]);

  return <TemplateProvidersContext.Provider value={providerState}>{children}</TemplateProvidersContext.Provider>;
};


