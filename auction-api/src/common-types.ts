import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import {  
  type Contract,
  type Witnesses,  
  STATE,  
  PrivateState,
  Maybe
} from '@meshsdk/auction-contract';

export type PrivateStates = Record<string, PrivateState>;

export type ContractInstance = Contract<PrivateState, Witnesses<PrivateState>>;

export type CircuitKeys = Exclude<keyof ContractInstance['impureCircuits'], number | symbol>;

export type Providers = MidnightProviders<CircuitKeys, PrivateStates>;

export type DeployedContract = FoundContract<PrivateState, ContractInstance>;

export type UserAction = {
  action: "opening-bid" | "opening-done" | "closing-bid" | "closing-done" | "approving-hashed" | "approving-hashedDone" | "registering" | "registering-done" | "bidding" | "bidding-done" | undefined;
  error: "opening-error" | "closing-error" | "approving-error" | "registering-error" | "bidding-error" | undefined;
};

export type DerivedState = {
  readonly state: STATE;  
  readonly whoami: string;  
  readonly registered: Maybe<Uint8Array>[]  
  userAction: UserAction
};

export const emptyState: DerivedState = {
  state: STATE.open, 
  whoami: 'unknown',  
  registered: [],
  userAction: { action: undefined, error: undefined }
};


