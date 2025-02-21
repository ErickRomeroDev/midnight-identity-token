import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { BlockfrostProvider, MeshTxBuilder } from "@meshsdk/core";


const Page = () => {
  const { connected, wallet } = useWallet();
  const blockchainProvider = new BlockfrostProvider('mainnet5I0Y4bPezJmM6PyTCPeCjvdJ1pbW7rht');

  const txBuilder = new MeshTxBuilder({
    fetcher: blockchainProvider,
    verbose: true,
  });

  const submitTx = async () => {
    if (connected) {
      const utxos = await wallet.getUtxos();
      const rewardAddresses = await wallet.getRewardAddresses();
      const rewardAddress = rewardAddresses[0];
      const changeAddress = await wallet.getChangeAddress();
      if (rewardAddress) {
        try {
          const unsignedTx = await txBuilder
            .txOut('addr1zyzpenlg0vywj7zdh9dzdeggaer94zvckfncv9c3886c36yafhxhu32dys6pvn6wlw8dav6cmp4pmtv7cc3yel9uu0nqhcjd29', [
              { unit: 'lovelace', quantity: '150000000' },
            ])
            .voteDelegationCertificate(
              {
                dRepId: 'drep1yf05mscx9y53363vc2zqc6jk0gqn6yvh8rz4lznv64ewl3cnmpwqu',
              },
              rewardAddress,
            )
            .changeAddress(changeAddress)
            .selectUtxosFrom(utxos)
            .complete();

          const signedTx = await wallet.signTx(unsignedTx);
          const txHash = await wallet.submitTx(signedTx);

          console.log(txHash);
        } catch {
          console.log('that did not work');
        }
      }
    }
  };

  const submitTxTest = async () => {
    if (connected) {
      const utxos = await wallet.getUtxos();
      const rewardAddresses = await wallet.getRewardAddresses();
      const rewardAddress = rewardAddresses[0];
      const changeAddress = await wallet.getChangeAddress();
      if (rewardAddress) {
        try {
          const unsignedTx = await txBuilder
            .txOut('addr1qyven0x24ujtl7ds60znrkcspe2lsw7s6drzhzlswufvej6px8c4u8333cd2q553fwsnm4j6qx4c6ykn6p9hhmwu9rnst99g0l', [
              { unit: 'lovelace', quantity: '1000000' },
            ])            
            .changeAddress(changeAddress)
            .selectUtxosFrom(utxos)
            .complete();

          const signedTx = await wallet.signTx(unsignedTx);
          const txHash = await wallet.submitTx(signedTx);

          console.log(txHash);
        } catch {
          console.log('that did not work');
        }
      }
    }
  };

  return (
    <div className='mt-[70px]'>
      <CardanoWallet />
      <div className='cursor-pointer' onClick={submitTx}>Submit Delegation Tx</div>
      <div className='cursor-pointer' onClick={submitTxTest}>Test Tx</div>
    </div>
  );
};

export default Page;
