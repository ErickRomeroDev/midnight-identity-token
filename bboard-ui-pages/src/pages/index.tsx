import { useDeployedContracts, useProviders } from '@/packages/midnight-contracts';
import { CardanoWallet, useAssets, useWallet } from '@/packages/midnight-react';

const Page = () => {
  const { address, coinPublicKey, encryptionPublicKey, walletName, hasConnectedWallet, isProofServerOnline } = useAssets();
  const { setOpen, disconnect } = useWallet();  
  const deploy = useDeployedContracts(); 
  const providers = useProviders();

  const deployContract = async () => {
    const contractState = await deploy.deployAndAddContract("yours");
    console.log({contractState})
    
  }

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
      <div onClick={deployContract} className='cursor-pointer'>Deploy Contract</div>
      <div>Message: {providers && providers.flowMessage}</div>
    </div>
  );
};

export default Page;