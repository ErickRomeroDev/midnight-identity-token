import { webcrypto } from 'crypto';
import path from 'path';
import { currentDir } from './config';
import { createLogger } from './logger-utils';
import { type TestConfiguration, TestEnvironment, TestProviders } from './localTest-class';
import { nativeToken, tokenType } from '@midnight-ntwrk/ledger';
import { type Wallet } from '@midnight-ntwrk/wallet-api';
import type { Resource } from '@midnight-ntwrk/wallet';
import { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import * as utils from '../utils/index.js';
import { API, type Providers } from '../index';

const my_own_wallet = '1ddf9400a719ebe1fb022aff0ed1b4f3feed7abcc94138d5d6b0523450b4c70b|03001a5e065fd1710ad50ff81f25ac2baa8f76dfe957a7570e3982a31d3d0f9e58e80e2f6bb0ee20dd38991d7217aa4ef2b5526e5fd8d6f43409'
const logDir = path.resolve(currentDir, '..', 'logs', 'tests', `${new Date().toISOString()}.log`);
const logger = await createLogger(logDir);

// @ts-expect-error It is required
globalThis.crypto = webcrypto;

globalThis.WebSocket = WebSocket;

let testEnvironment: TestEnvironment;
let testConfiguration: TestConfiguration;
let wallet: Wallet & Resource;
let providers1: Providers;
let owner: API;
let tokenAddress: ContractAddress;
let keepAliveInterval: any;

beforeAll(async () => {
  testEnvironment = new TestEnvironment(logger);
  testConfiguration = await testEnvironment.start();
  wallet = await testEnvironment.getWallet1();
  console.log("fase1")
  providers1 = await new TestProviders().configureTokenProviders(wallet, testConfiguration.dappConfig);
  console.log("fase2")
  const contractPrivateId1 = 'owner';
  owner = await API.deploy(contractPrivateId1, providers1, logger); 
  console.log("fase3")
  tokenAddress = owner.deployedContractAddress;
  logger.info({tokenAddress});

  keepAliveInterval = setInterval(() => {
    console.log('Keeping container alive...');
  }, 60000); // every 60 seconds
});

afterAll(async () => {
  try {
    // await testEnvironment.shutdown();
    clearInterval(keepAliveInterval);
    await new Promise(() => {});
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

async function sendCustomToken(address: string, amount: bigint): Promise<string> {
  const transferRecipe = await wallet.transferTransaction([
    {
      amount,
      receiverAddress: address,
      type: tokenType(utils.pad('mesh_coin', 32), tokenAddress),
    },
  ]);
  const transaction = await wallet.proveTransaction(transferRecipe);
  return await wallet.submitTransaction(transaction);
}

test('prepare local env', async () => {
  // fund my wallets
  await sendNativeToken(
    my_own_wallet,
    10000n * 1000000n,
  );
  console.log('funded');

  await owner.mint();

  await sendCustomToken(
    my_own_wallet,
    100n,
  );

  await wallet.close();
});
