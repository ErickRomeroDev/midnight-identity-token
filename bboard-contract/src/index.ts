import ContractModule, { Ledger } from './managed/bboard/contract/index.cjs';
import type { Contract as ContractType, Witnesses } from './managed/bboard/contract/index.cjs';
import { WitnessContext } from '@midnight-ntwrk/compact-runtime';

export * from './managed/bboard/contract/index.cjs';
export const ledger = ContractModule.ledger;
export const pureCircuits = ContractModule.pureCircuits;
export const { Contract } = ContractModule;
export type Maybe<T> = ContractModule.Maybe<T>;
export type Contract<T, W extends Witnesses<T> = Witnesses<T>> = ContractType<T, W>;

export type PrivateState = {  
  readonly secretKey: Uint8Array; 
};

export const createPrivateState = (secretKey: Uint8Array) => ({
   secretKey, 
});

export const witnesses = {
  local_secret_key: ({ privateState }: WitnessContext<Ledger, PrivateState>): [PrivateState, Uint8Array] => [
    
    privateState, 
    privateState.secretKey, 
  ],
};

