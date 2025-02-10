import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import {  
  type Contract,
  type Witnesses,  
  STATE,  
  PrivateState
} from '@meshsdk/bboard-contract';

export type PrivateStates = Record<string, PrivateState>;

export type ContractInstance = Contract<PrivateState, Witnesses<PrivateState>>;

export type CircuitKeys = Exclude<keyof ContractInstance['impureCircuits'], number | symbol>;

export type Providers = MidnightProviders<CircuitKeys, PrivateStates>;

export type DeployedContract = FoundContract<PrivateState, ContractInstance>;

export type UserAction = {
  move: string | undefined;
  cancel: string | undefined;
};

export type DerivedState = {
  readonly state: STATE;  
  readonly whoami: string;
  readonly instance: bigint;
  readonly message: string | undefined;   
  readonly isOwner: boolean;
};

export const emptyState: DerivedState = {
  state: STATE.vacant, 
  whoami: 'unknown',  
  instance: 0n,
  message: undefined,
  isOwner: false 
};


