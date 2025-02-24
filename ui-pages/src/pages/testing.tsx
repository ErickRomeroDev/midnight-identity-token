import { useProviders } from '@/packages/midnight-contracts/token';
import { ContractState, useDeployedContracts, useProviders as useProvidersAuction } from '@/packages/midnight-contracts/auction';
import { useSubscriptions } from '@/modules/midnight-contracts/token/hooks/use-subscriptions';
import { CardanoWallet, useAssets, useWallet } from '@/packages/midnight-react';
import { useAuctionContractsSubscriptions } from '@/modules/midnight-contracts/auction/hooks/use-contracts-subscriptions';
import { useAuctionContractSubscription } from '@/modules/midnight-contracts/auction/hooks/use-contract-subscription';

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

  const register = () => {
    if (deployedContractAPI) {
      deployedContractAPI.register();
    }
  }
  return (
    <>
      <div>{contractStates.address}</div>
      <div>{contractStates.contractType}</div>
      <div>{contractState?.whoami}</div>
      <div onClick={register}> Registrar no BID</div>
    </>
  );
};
