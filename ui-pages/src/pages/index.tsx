import { useDeployedContracts, useProviders, ContractState, ContractDeployment } from '@/packages/midnight-contracts/token';
import { CardanoWallet, useAssets, useWallet } from '@/packages/midnight-react';
import { DeployedAPI, DerivedState } from '@meshsdk/token-api';
import { useCallback, useEffect, useState } from 'react';
import { auditTime, distinctUntilChanged, Observable } from 'rxjs';

const Page = () => {
  const { address, coinPublicKey, encryptionPublicKey, walletName, hasConnectedWallet, isProofServerOnline } = useAssets();
  const { setOpen, disconnect } = useWallet();
  const deploy = useDeployedContracts();
  const providers = useProviders();
  const [tokenContractStates, setTokenContractStates] = useState<ContractState[]>([]);
  const [tokenDeploymentObservable, setTokenDeploymentObservable] = useState<Observable<ContractDeployment> | undefined>(
    undefined,
  );
  const [tokenDeployment, setTokenDeployment] = useState<ContractDeployment>();
  const [deployedAPI, setDeployedAPI] = useState<DeployedAPI>();
  const [derivedState, setDerivedState] = useState<DerivedState>();

  useEffect(() => {
    if (!deploy) {
      return;
    }
    const subscription = deploy.contractDeployments$.subscribe(setTokenContractStates);

    return () => {
      subscription.unsubscribe();
    };
  }, [deploy]);

  const onJoin = useCallback(async (): Promise<void> => {
    setTokenDeploymentObservable(deploy.addContract('recent').observable);
  }, [deploy, setTokenDeploymentObservable]);

  useEffect(() => {
    if (hasConnectedWallet && providers) {
      void onJoin();
    }
  }, [onJoin, hasConnectedWallet, providers]);

  useEffect(() => {
    if (!tokenDeploymentObservable) {
      return;
    }
    const subscription = tokenDeploymentObservable.subscribe(setTokenDeployment);

    return () => {
      subscription.unsubscribe();
    };
  }, [tokenDeploymentObservable]);

  useEffect(() => {
    if (!tokenDeployment) {
      return;
    }
    if (tokenDeployment.status === 'in-progress') {
      return;
    }    

    if (tokenDeployment.status === 'failed') {      
      return;
    }
    setDeployedAPI(tokenDeployment.api);
    const subscription = tokenDeployment.api.state$
      .pipe(auditTime(1000), distinctUntilChanged())
      .subscribe(setDerivedState);
    return () => {
      subscription.unsubscribe();
    };
  }, [tokenDeployment, setDeployedAPI]);

  console.log({ tokenContractStates });
  console.log({ tokenDeployment });
  console.log({deployedAPI});
  console.log({derivedState})

  const mint = () => {
    if (deployedAPI) {
      deployedAPI.mint()
    }
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
      <div onClick={mint} className="cursor-pointer">
        Mint Token
      </div>
      <div>Message: {providers && providers.flowMessage}</div>
    </div>
  );
};

export default Page;
