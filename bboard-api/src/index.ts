import { type ContractAddress, tokenType, convert_bigint_to_Uint8Array } from '@midnight-ntwrk/compact-runtime';
import { type Logger } from 'pino';
import {
  type ContractInstance,
  type DerivedState,
  type Providers,
  type DeployedContract,
  emptyState,
  type PrivateStates,
  type UserAction,
} from './common-types.js';
import {
  type PrivateState,
  Contract,
  createPrivateState,
  ledger,
  pureCircuits,
  witnesses,
  type CoinInfo,
} from '@meshsdk/bboard-contract';
import * as utils from './utils/index.js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { combineLatest, concat, defer, from, map, type Observable, of, retry, scan, Subject } from 'rxjs';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
import type { PrivateStateProvider } from '@midnight-ntwrk/midnight-js-types/dist/private-state-provider';
import { encodeTokenType } from '@midnight-ntwrk/onchain-runtime';
import { encodeContractAddress, nativeToken } from '@midnight-ntwrk/ledger';

const contractInstance: ContractInstance = new Contract(witnesses);

export interface DeployedAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<DerivedState>;

  post: (new_message: string) => Promise<void>;
  take_down: () => Promise<void>;
  charge: () => Promise<void>;
  withdraw: () => Promise<void>;
}

export class API implements DeployedAPI {
  private constructor(
    public readonly contractPrivateId: string,
    public readonly tokenContractAddress: ContractAddress,
    public readonly deployedContract: DeployedContract,
    public readonly providers: Providers,
    private readonly logger: Logger,
  ) {
    const combine = (acc: DerivedState, value: DerivedState): DerivedState => {
      return {
        state: value.state,
        instance: value.instance,
        message: value.message,
        isOwner: value.isOwner,
        whoami: value.whoami,
      };
    };
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    this.turns$ = new Subject<UserAction>();
    this.privateStates$ = new Subject<PrivateState>();
    this.state$ = combineLatest(
      [
        providers.publicDataProvider
          .contractStateObservable(this.deployedContractAddress, { type: 'all' })
          .pipe(map((contractState) => ledger(contractState.data))),
        concat(
          from(defer(() => providers.privateStateProvider.get(contractPrivateId) as Promise<PrivateState>)),
          this.privateStates$,
        ),
        concat(of<UserAction>({ move: undefined, cancel: undefined }), this.turns$),
      ],
      (ledgerState, privateState, userActions) => {
        const whoami = pureCircuits.public_key(
          privateState.secretKey,
          convert_bigint_to_Uint8Array(32, ledgerState.instance),
        );
        const result: DerivedState = {
          state: ledgerState.state,
          message: ledgerState.message.value,
          instance: ledgerState.instance,
          isOwner: toHex(ledgerState.poster) === toHex(whoami),
          whoami: toHex(whoami),
        };
        return result;
      },
    ).pipe(
      scan(combine, emptyState),
      retry({
        // sometimes websocket fails 
        delay: 500,
      }),
    );
  }

  readonly deployedContractAddress: ContractAddress;

  readonly state$: Observable<DerivedState>;

  readonly turns$: Subject<UserAction>;

  readonly privateStates$: Subject<PrivateState>;

  async post(message: string): Promise<void> {
    this.logger?.info('Posting message');
    this.turns$.next({
      move: 'Making a post',
      cancel: undefined,
    });

    try {
      const txData = await this.deployedContract.callTx.post(message);
      this.logger?.trace({
        post: {
          message,
          txHash: txData.public.txHash,
          blockHeight: txData.public.blockHeight,
        },
      });
    } catch (e) {
      this.turns$.next({
        move: undefined,
        cancel: 'Post was cancelled',
      });
      throw e;
    }
  }

  async take_down(): Promise<void> {
    this.logger?.info('Taking down message');
    this.turns$.next({
      move: 'Taking down a post',
      cancel: undefined,
    });
    try {
      const txData = await this.deployedContract.callTx.take_down();
      this.logger?.trace({
        takedown: {
          txHash: txData.public.txHash,
          blockHeight: txData.public.blockHeight,
        },
      });
    } catch (e) {
      this.turns$.next({
        move: undefined,
        cancel: 'canceled take down a post',
      });
      throw e;
    }
  }

  coin(): CoinInfo {
    return {
      nonce: utils.randomBytes(32),
      color: encodeTokenType(tokenType(utils.pad('test_coin', 32), this.tokenContractAddress)),
      value: 100n,
    };
  } 

  coin_dust(): CoinInfo {
    return {
      nonce: utils.randomBytes(32),
      color: encodeTokenType(nativeToken()),
      value: 100n,
    };
  }

  async charge(): Promise<void> {
    this.logger?.info('Charging the contract');
    this.turns$.next({
      move: 'Charge',
      cancel: undefined,
    });
    try {
      const txData = await this.deployedContract.callTx.charge(this.coin());
      this.logger?.trace({
        takedown: {
          txHash: txData.public.txHash,
          blockHeight: txData.public.blockHeight,
        },
      });
    } catch (e) {
      this.turns$.next({
        move: undefined,
        cancel: 'Charge cancelled',
      });
      throw e;
    }
  }

  async withdraw(): Promise<void> {
    this.logger?.info('Withdrawing money');
    this.turns$.next({
      move: 'withdrawing money',
      cancel: undefined,
    });
    try {
      const txData = await this.deployedContract.callTx.withdraw();
      this.logger?.trace({
        takedown: {
          txHash: txData.public.txHash,
          blockHeight: txData.public.blockHeight,
        },
      });
    } catch (e) {
      this.turns$.next({
        move: undefined,
        cancel: 'withdrawing money cancelled',
      });
      throw e;
    }
  }

  static async deploy(
    contractPrivateId: string,
    tokenContractAddress: string,
    providers: Providers,
    logger: Logger,
  ): Promise<API> {
    logger.info({
      deployContract: {
        contractPrivateId,        
      },
    });
    console.log("dentro da class para ver Providers:", providers);
    const deployedTemplateContract = await deployContract(providers, {
      privateStateKey: contractPrivateId,
      contract: contractInstance,
      initialPrivateState: await API.getPrivateState(contractPrivateId, providers.privateStateProvider),
      args: [
        {
          bytes: encodeContractAddress(tokenContractAddress),
        },
      ],
    });

    logger.trace({
      contractDeployed: {
        contractPrivateId,
        finalizedDeployTxData: deployedTemplateContract.deployTxData.public,
      },
    });

    return new API(contractPrivateId, tokenContractAddress, deployedTemplateContract, providers, logger);
  }

  static async subscribe(
    contractPrivateId: string,
    tokenContractAddress: ContractAddress,
    providers: Providers,
    contractAddress: ContractAddress,
    logger: Logger,
  ): Promise<API> {
    logger.info({
      subscribeContract: {
        contractPrivateId,
        contractAddress,
      },
    });

    const deployedContract = await findDeployedContract(providers, {
      contractAddress,
      contract: contractInstance,
      privateStateKey: contractPrivateId,
      initialPrivateState: await API.getPrivateState(contractPrivateId, providers.privateStateProvider),
    });

    logger.trace({
      contractSubscribed: {
        contractPrivateId,
        finalizedDeployTxData: deployedContract.deployTxData.public,
      },
    });

    return new API(contractPrivateId, tokenContractAddress, deployedContract, providers, logger);
  }

  static async getOrCreateInitialPrivateState(
    privateStateProvider: PrivateStateProvider<PrivateStates>,
  ): Promise<PrivateState> {
    let state = await privateStateProvider.get('start');
    
    if (state === null) {
      state = this.createPrivateState(utils.randomBytes(32));
      await privateStateProvider.set('start', state);
    }
    return state;
  }

  static async exists(providers: Providers, contractAddress: ContractAddress): Promise<boolean> {
    
    try {
      const state = await providers.publicDataProvider.queryContractState(contractAddress);
      if (state === null) {
        return false;
      }
      void ledger(state.data); // try to parse it
      return true;
    } catch (e) {
      return false;
    }
  }

  static async getPublicKey(providers: Providers, contractAddress: ContractAddress): Promise<Uint8Array | null> {
    const private_state = await this.getOrCreateInitialPrivateState(providers.privateStateProvider);
    const public_state = await providers.publicDataProvider.queryContractState(contractAddress);
    if (public_state === null) {
      return null;
    }
    const state = ledger(public_state.data);
    return pureCircuits.public_key(private_state.secretKey, convert_bigint_to_Uint8Array(32, state.instance));
  }

  private static async getPrivateState(
    templateId: string,
    providers: PrivateStateProvider<PrivateStates>,
  ): Promise<PrivateState> {
    const existingPrivateState = await providers.get(templateId);
    const initialState = await this.getOrCreateInitialPrivateState(providers);
    return existingPrivateState ?? this.createPrivateState(initialState.secretKey);
  }

  private static createPrivateState(localSecretKey: Uint8Array): PrivateState {    
    return createPrivateState(localSecretKey);
  }
}

export * as utils from './utils/index.js';
export * from './common-types.js';
