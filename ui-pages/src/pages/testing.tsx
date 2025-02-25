import { useProviders } from '@/packages/midnight-contracts/token';
import {
  ContractState,
  useDeployedContracts,
  useLocalState,
  useProviders as useProvidersAuction,
} from '@/packages/midnight-contracts/auction';
import { useSubscriptions } from '@/modules/midnight-contracts/token/hooks/use-subscriptions';
import { CardanoWallet, useAssets, useWallet } from '@/packages/midnight-react';
import { useAuctionContractsSubscriptions } from '@/modules/midnight-contracts/auction/hooks/use-contracts-subscriptions';
import { useAuctionContractSubscription } from '@/modules/midnight-contracts/auction/hooks/use-contract-subscription';
import { Certificate, createPrivateState, Maybe } from '@meshsdk/auction-contract';
import { encodeCoinPublicKey } from '@midnight-ntwrk/compact-runtime';
import { utils } from '@meshsdk/auction-api';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';

const Page = () => {
  const { address, coinPublicKey, encryptionPublicKey, walletName, hasConnectedWallet, isProofServerOnline } = useAssets();
  const { setOpen, disconnect } = useWallet();

  const providers = useProviders();
  const { tokenDeployment, deployedAPI, derivedState } = useSubscriptions();

  const providersAuction = useProvidersAuction();
  const deploy = useDeployedContracts();
  const { auctionContractDeployments } = useAuctionContractsSubscriptions();

  console.log({ providersAuction });
  console.log({ auctionContractDeployments });

  console.log({ tokenDeployment });
  console.log({ deployedAPI });
  console.log({ derivedState });

  const mint = () => {
    if (deployedAPI) {
      deployedAPI.mint();
    }
  };

  const addDeployAuctionContract = () => {
    if (deploy) {
      deploy.deployAndAddContract('recent', 'title', 'description', 10, 'monday', 'image');
    }
  };

  return (
    <div className="flex flex-col text-white pt-40">
      <CardanoWallet />
      <div>Address: {address}</div>
      <div>Coin PublicKey: {coinPublicKey}</div>
      <div>Encryption PublicKey: {encryptionPublicKey}</div>
      <div>Wallet Name: {walletName}</div>
      <div>Wallet is connected: {hasConnectedWallet.toString()}</div>
      <div>Is Proof Server Online: {isProofServerOnline.toString()}</div>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        Open Wallet
      </div>
      <div className="cursor-pointer" onClick={() => disconnect()}>
        Disconnect Wallet
      </div>
      <div onClick={mint} className="cursor-pointer">
        Mint Token
      </div>
      <div>Message: {providers && providers.flowMessage}</div>
      <div onClick={addDeployAuctionContract} className="cursor-pointer">
        Deploy and Add Auction Contract
      </div>
      <div>Message: {providersAuction && providersAuction.flowMessage}</div>
      {auctionContractDeployments.map((contractState, i) => (
        <div key={i}>
          <ContractPage contractStates={contractState} />
        </div>
      ))}
    </div>
  );
};

export default Page;

interface ContractPageProps {
  contractStates: ContractState;
}

const ContractPage = ({ contractStates }: ContractPageProps) => {
  const { deployedContractAPI, contractState } = useAuctionContractSubscription(contractStates);
  const providersAuction = useProvidersAuction();
  const localStorage = useLocalState();
  const { coinPublicKey } = useAssets();

  const register = () => {
    if (deployedContractAPI) {
      deployedContractAPI.register();
    }
  };

  const list_register = () => {
    if (deployedContractAPI && contractState) {
      const list = contractState.registered.map((cert) => {
        if (cert.is_some) {
          return toHex(cert.value);
        }
      });
      console.log(list);
    }
  };

  const list_confirmed = () => {
    if (deployedContractAPI && contractState) {
      const list = contractState.confirmed.map((cert) => {
        if (cert.is_some) {
          return toHex(cert.value);
        }
      });
      console.log(list);
    }
  };

  const approve_certificates = (approvedHexCertificates: string[]) => {
    if (deployedContractAPI && contractState) {
      const maybeKeys: Maybe<Uint8Array>[] = [];
      const MAX_KEYS = 10;
      for (let i = 0; i < contractState.registered.length && maybeKeys.length < MAX_KEYS; i++) {
        const cert = contractState.registered[i];
      if (cert.is_some) {
        // Convert the stored certificate to a hex string.
        const certHex = toHex(cert.value);
        // Only include this certificate if its hex representation is in our approved list.
        if (approvedHexCertificates.includes(certHex)) {
          maybeKeys.push(cert);
        }
      }
      }
      while (maybeKeys.length < 10) {
        maybeKeys.push({
          is_some: false,
          value: new Uint8Array(32),
        });
      }
      deployedContractAPI.approve_certificates(maybeKeys);
    }
  };

  const start_auction = () => {
    if (deployedContractAPI) {
      deployedContractAPI.start_bid();
    }
  };

  const bid = () => {
    if (deployedContractAPI) {
      deployedContractAPI.make_bid(11);
    }
  };

  const close_auction = () => {
    if (deployedContractAPI) {
      deployedContractAPI.close_bid();
    }
  };

  const set_myId = () => {
    if (providersAuction && contractStates.address && coinPublicKey) {
      const p1certificate: Certificate = {
        age: 19n,
        aml: true,
        jurisdiction: true,
        owner: { bytes: encodeCoinPublicKey(coinPublicKey) },
        issuer: { bytes: new Uint8Array(32) },
        sk: utils.randomBytes(32),
      };
      const my_private_key = localStorage.getContractPrivateId(contractStates.address);
      if (!my_private_key) return;
      providersAuction.privateStateProvider.set(my_private_key, createPrivateState(p1certificate));
    }
  };
  return (
    <>
      <div>{contractStates.address}</div>
      <div>{contractStates.contractType}</div>
      <div>{contractState?.whoami}</div>
      <div onClick={set_myId}>Set My ID</div>
      <div onClick={register}> Registrar no BID</div>
      <div onClick={list_register}> See list of registered certificates</div>
      <div onClick={list_confirmed}> See list of confirmed certificates</div>
      <div onClick={() => approve_certificates(["eb7ea468ce5a65f6d835021df70085cbf63a76d122dc58641bd98ce6cedb6af8"])}> Approve Certificates</div>
      <div onClick={start_auction}> Start Auction</div>
      <div onClick={bid}> Make Bid of 11</div>
      <div onClick={close_auction}> Close Auction</div>
    </>
  );
};
