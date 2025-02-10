import { webcrypto } from 'crypto';
import path from 'path';
import { currentDir } from './config';
import { createLogger } from './logger-utils';
import {
  type CoinContract,
  type CoinProviders,
  type TestConfiguration,
  TestEnvironment,
  TestProviders,
} from './bboard-localTest-class';
import { nativeToken } from '@midnight-ntwrk/ledger';
import { type Wallet } from '@midnight-ntwrk/wallet-api';
import type { Resource } from '@midnight-ntwrk/wallet';
import { Contract } from '../../../token-contract/dist';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { randomBytes } from '../utils';

const logDir = path.resolve(currentDir, '..', 'logs', 'tests', `${new Date().toISOString()}.log`);
const logger = await createLogger(logDir);

// @ts-expect-error It is required
globalThis.crypto = webcrypto;

globalThis.WebSocket = WebSocket;

let testEnvironment: TestEnvironment;
let testConfiguration: TestConfiguration;
let wallet: Wallet & Resource;

beforeAll(async () => {
  testEnvironment = new TestEnvironment(logger);
  testConfiguration = await testEnvironment.start();
  wallet = await testEnvironment.getWallet1();
}, 10 * 60_000);

afterAll(async () => {
  try {
    await testEnvironment.shutdown();
  } catch (e) {
    // ignore
  }
});

async function sendNativeToken(address: string, amount: bigint): Promise<string> {
  const transferRecipe = await wallet.transferTransaction([
    {
      amount,
      receiverAddress: address,
      type: nativeToken(),
    },
  ]);
  const transaction = await wallet.proveTransaction(transferRecipe);
  return await wallet.submitTransaction(transaction);
}

async function deployCoinContract(tokenProvider: CoinProviders) {
  const coinContract: CoinContract = new Contract({});
  const deployedContract = await deployContract(tokenProvider, {
    privateStateKey: 'coin',
    contract: coinContract,
    initialPrivateState: {},
    args: [randomBytes(32)],
  });
  console.log('deployed at', deployedContract.deployTxData.public.contractAddress);
}

test('prepare local env', async () => {
  // fund my wallets
  await sendNativeToken(
    '5feff6534cae3d59e03275b299f2cd052e02e2084cfd63c4fff2568971c1343e|0300aa6a2d2ed980354bc5f14d595e6b6d8bd740bb99e9115c167c357e2b52865cb808f54d5ce551b5d79df33bb3878baaba5aa8a1be4d510b88',
    10000000000n,
  );

  await sendNativeToken(
    '5feff6534cae3d59e03275b299f2cd052e02e2084cfd63c4fff2568971c1343e|0300aa6a2d2ed980354bc5f14d595e6b6d8bd740bb99e9115c167c357e2b52865cb808f54d5ce551b5d79df33bb3878baaba5aa8a1be4d510b88',
    10000000000n,
  );

  // deploy coin contract
  const tokenProvider = await new TestProviders().configureTokenProviders(wallet, testConfiguration.dappConfig);
  await deployCoinContract(tokenProvider);

  await wallet.close();
});
