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
import { MidnightProvider, ProofProvider, PublicDataProvider, ZKConfigProvider, createBalancedTx, } from '@midnight-ntwrk/midnight-js-types';
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
import { useTemplateLocalState } from '../hooks';
import { connectToWallet } from '@/packages/midnight-core/common/connectToWallet';
import { ProviderCallbackAction } from '@/packages/midnight-core';
import { MidnightWalletErrorType } from '@/packages/midnight-core/types/walletTypes';
import { type Address, type CoinPublicKey } from '@midnight-ntwrk/wallet-api';
import type { DAppConnectorWalletAPI, ServiceUriConfig } from '@midnight-ntwrk/dapp-connector-api';

function isChromeBrowser(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('chrome') && !userAgent.includes('edge') && !userAgent.includes('opr');
}

export interface TemplateProvidersState {
  isConnected: boolean;
  proofServerIsOnline: boolean;
  address?: Address;
  widget?: React.ReactNode;
  walletAPI?: WalletAPI;
  privateStateProvider: PrivateStateProvider<PrivateStates>;
  zkConfigProvider: ZKConfigProvider<CircuitKeys>;
  proofProvider: ProofProvider<CircuitKeys>;
  publicDataProvider: PublicDataProvider;
  walletProvider: WalletProvider;
  midnightProvider: MidnightProvider;
  providers: Providers;
  shake: () => void;
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

export const getErrorType = (error: Error): MidnightWalletErrorType => {
  if (error.message.includes('Could not find Midnight Lace wallet')) {
    return MidnightWalletErrorType.WALLET_NOT_FOUND;
  }
  if (error.message.includes('Incompatible version of Midnight Lace wallet')) {
    return MidnightWalletErrorType.INCOMPATIBLE_API_VERSION;
  }
  if (error.message.includes('Wallet connector API has failed to respond')) {
    return MidnightWalletErrorType.TIMEOUT_API_RESPONSE;
  }
  if (error.message.includes('Could not find wallet connector API')) {
    return MidnightWalletErrorType.TIMEOUT_FINDING_API;
  }
  if (error.message.includes('Unable to enable connector API')) {
    return MidnightWalletErrorType.ENABLE_API_FAILED;
  }
  if (error.message.includes('Application is not authorized')) {
    return MidnightWalletErrorType.UNAUTHORIZED;
  }
  return MidnightWalletErrorType.UNKNOWN_ERROR;
};



export const TemplateProvidersContext = createContext<TemplateProvidersState | null>(null);

export const TemplateProvider = ({ children, logger }: TemplateAppProviderProps) => {
  const [snackBarText, setSnackBarText] = useState<string | undefined>(undefined);  
  const localState = useTemplateLocalState(); 
  const [proofServerIsOnline, setProofServerIsOnline] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [walletError, setWalletError] = useState<MidnightWalletErrorType | undefined>(undefined);
  const [openWallet, setOpenWallet] = useState(false);
  const [address, setAddress] = useState<Address | undefined>(undefined);
  const [walletAPI, setWalletAPI] = useState<WalletAPI | undefined>(undefined);
  const [isRotate, setRotate] = useState(false);
  const [floatingOpen, setFloatingOpen] = useState(true);

  const onMintTransaction = (success: boolean): void => {
    if (success) {
      setSnackBarText('Minting tBTC was successful');
    } else {
      setSnackBarText('Minting tBTC failed');
    }
    setTimeout(() => {
      setSnackBarText(undefined);
    }, 3000);
  };

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

  const zkConfigProvider = useMemo(
    () =>
      new CachedFetchZkConfigProvider<CircuitKeys>(
        `${window.location.origin}/template`,
        fetch.bind(window),
        providerCallback,
      ),
    [],
  );

  const publicDataProvider = useMemo(() => {   
    if (walletAPI) {
      new WrappedPublicDataProvider(indexerPublicDataProvider(walletAPI.uris.indexerUri, walletAPI.uris.indexerWsUri), providerCallback, logger);
      
    }     
  }, [logger, walletAPI]);

  function shake(): void {
    setRotate(true);
    setSnackBarText('Please connect to your Midnight Lace wallet');
    setTimeout(() => {
      setRotate(false);
      setSnackBarText(undefined);
    }, 3000);
  }

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
    isConnected: false,
    proofServerIsOnline: false,
    address: undefined,
    widget: undefined,
    walletAPI,
    privateStateProvider,
    zkConfigProvider,
    proofProvider,
    publicDataProvider,
    walletProvider,
    midnightProvider,
    shake,
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

  async function checkProofServerStatus(proverServerUri: string): Promise<void> {
    try {
      const response = await fetch(proverServerUri);
      if (!response.ok) {
        setProofServerIsOnline(false);
      }
      const text = await response.text();
      setProofServerIsOnline(text.includes("We're alive 🎉!"));
    } catch (error) {
      setProofServerIsOnline(false);
    }
  }

  async function connect(manual: boolean): Promise<void> {
    localState.setLaceAutoConnect(true);
    setIsConnecting(true);
    let walletResult;
    try {
      walletResult = await connectToWallet(logger);
    } catch (e) {
      const walletError = getErrorType(e as Error);
      setWalletError(walletError);
      setIsConnecting(false);
    }
    if (!walletResult) {
      setIsConnecting(false);
      if (manual) setOpenWallet(true);
      return;
    }
    await checkProofServerStatus(walletResult.uris.proverServerUri);
    try {
      const reqState = await walletResult.wallet.state();
      setAddress(reqState.address);
      setWalletAPI({
        wallet: walletResult.wallet,
        coinPublicKey: reqState.coinPublicKey,
        uris: walletResult.uris,
      });
    } catch (e) {
      setWalletError(MidnightWalletErrorType.TIMEOUT_API_RESPONSE);
    }
    setIsConnecting(false);
  }

  useEffect(() => {
    setProviderState((state) => ({
      ...state,
      walletAPI,
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

  useEffect(() => {
    setProviderState((state) => ({
      ...state,
      isConnected: !!address,
      proofServerIsOnline,
      address,
      widget: WalletWidget(
        () => connect(true), // manual connect
        setOpenWallet,
        isRotate,
        openWallet,
        isChromeBrowser(),
        proofServerIsOnline,
        isConnecting,
        logger,
        onMintTransaction,
        floatingOpen,
        setFloatingOpen,
        walletError,
        snackBarText,
        address,
      ),
      shake,
    }));
  }, [isConnecting, walletError, address, openWallet, isRotate, proofServerIsOnline, snackBarText, floatingOpen, logger]);

  useEffect(() => {
    if (!providerState.isConnected && !isConnecting && !walletError && localState.isLaceAutoConnect()) {
      void connect(false); // auto connect
    }
  }, [providerState.isConnected, isConnecting, localState, walletError]);

  return <TemplateProvidersContext.Provider value={providerState}>{children}</TemplateProvidersContext.Provider>;
};
