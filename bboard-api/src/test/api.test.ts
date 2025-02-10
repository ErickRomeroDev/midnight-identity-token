import { STATE, CoinInfo } from '@meshsdk/bboard-contract';
import { type Resource } from '@midnight-ntwrk/wallet';
import { type Wallet } from '@midnight-ntwrk/wallet-api';
import { webcrypto } from 'crypto';
import path from 'path';
import { API, type Providers, emptyState } from '..';
import { type CoinContract, type CoinProviders, TestEnvironment, TestProviders } from './bboard-localTest-class';
import { Contract } from '../../../token-contract/dist';
import { currentDir } from './config';
import { createLogger } from './logger-utils';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { randomBytes } from '../utils';
import { encodeTokenType, nativeToken, type ContractAddress } from '@midnight-ntwrk/ledger';
import * as utils from '../utils/index.js';

const logDir = path.resolve(currentDir, '..', 'logs', 'tests', `${new Date().toISOString()}.log`);
const logger = await createLogger(logDir);

// @ts-expect-error It is required
globalThis.crypto = webcrypto;

globalThis.WebSocket = WebSocket;

const coin_dust = (): CoinInfo => {
  return {
    nonce: utils.randomBytes(32),
    color: encodeTokenType(nativeToken()),
    value: 200n,
  };
};

describe('Game', () => {
  let testEnvironment: TestEnvironment;
  let wallet: Wallet & Resource;
  let wallet2: Wallet & Resource;
  let providers1: Providers;
  let providers2: Providers;
  let tokenAddress: ContractAddress;

  async function mint(tokenProvider: CoinProviders) {
    const coinContract: CoinContract = new Contract({});
    await tokenProvider.privateStateProvider.set('coin2', {});
    const contractDeployed = await findDeployedContract(tokenProvider, {
      privateStateKey: 'coin2',
      contractAddress: tokenAddress,
      contract: coinContract,
    });
    console.log('we managed to deploy the minting contract');
    await contractDeployed.callTx.mint(coin_dust());
  }

  async function owner_withdraw(tokenProvider: CoinProviders) {
    const coinContract: CoinContract = new Contract({});
    await tokenProvider.privateStateProvider.set('coin2', {});
    const contractDeployed = await findDeployedContract(tokenProvider, {
      privateStateKey: 'coin2',
      contractAddress: tokenAddress,
      contract: coinContract,
    });
    await contractDeployed.callTx.owner_withdraw();
  }

  async function deploy(tokenProvider: CoinProviders) {
    const coinContract: CoinContract = new Contract({});
    const deployedContract = await deployContract(tokenProvider, {
      privateStateKey: 'coin',
      contract: coinContract,
      initialPrivateState: {},
      args: [randomBytes(32)],
    });
    tokenAddress = deployedContract.deployTxData.public.contractAddress;
  }

  beforeAll(async () => {
    testEnvironment = new TestEnvironment(logger);
    const testConfiguration = await testEnvironment.start();
    wallet = await testEnvironment.getWallet1();
    wallet2 = await testEnvironment.getWallet2();
    providers1 = await new TestProviders().configureProviders(wallet, testConfiguration.dappConfig);
    providers2 = await new TestProviders().configureProviders(wallet2, testConfiguration.dappConfig);
    const tokenProvider1 = await new TestProviders().configureTokenProviders(wallet, testConfiguration.dappConfig);
    await deploy(tokenProvider1);
    const tokenProvider2 = await new TestProviders().configureTokenProviders(wallet2, testConfiguration.dappConfig);
    console.log('Before tokens Minted');
    await mint(tokenProvider1);
    // await mint(tokenProvider2);
    console.log('Custom tokens Minted');
  }, 10 * 60_000);

  afterAll(async () => {
    await testEnvironment.shutdown();
  });

  it('should simulate all contracts', async () => {
    const userId = 'user';
    const player1 = await API.deploy(userId, tokenAddress, providers1, logger);
    let userState = emptyState;
    const player1Subscription = player1.state$.subscribe((bBoardState) => {
      userState = bBoardState;
    });
    console.log('Post');
    await player1.post('hola');
    console.log('Take down');
    await player1.take_down();
    console.log('Charge');
    await player1.charge();
    console.log('Withdraw');
    await player1.withdraw();
    console.log('All finished');

    player1Subscription.unsubscribe();
  });
});
