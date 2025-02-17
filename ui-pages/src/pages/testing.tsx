import { useProviders } from '@/packages/midnight-contracts/token';
import { useSubscriptions } from '@/packages/midnight-contracts/token/hooks/use-subscriptions';
import { CardanoWallet, useAssets, useWallet } from '@/packages/midnight-react';

const Page = () => {
  const { address, coinPublicKey, encryptionPublicKey, walletName, hasConnectedWallet, isProofServerOnline } = useAssets();
  const { setOpen, disconnect } = useWallet();

  const providers = useProviders();
  const { tokenContractStates, tokenDeployment, deployedAPI, derivedState, turnsState } = useSubscriptions();

  console.log({ tokenContractStates });
  console.log({ tokenDeployment });
  console.log({ deployedAPI });
  console.log({ derivedState });
  console.log({ turnsState });

  const mint = () => {        
    if (deployedAPI) {
      deployedAPI.mint();
    }
  };  

  return (
    <div className="flex flex-col">
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
    </div>
  );
};

export default Page;
