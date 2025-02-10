export * from './managed/token/contract/index.cjs';

export type PrivateState = Record<string, never>;

export const createPrivateState = (): PrivateState => ({})

export const witnesses = {};