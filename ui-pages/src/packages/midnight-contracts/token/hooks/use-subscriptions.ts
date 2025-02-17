import { useDeployedContracts, useProviders, ContractState, ContractDeployment } from '@/packages/midnight-contracts/token';
import { useAssets } from '@/packages/midnight-react';
import { DeployedAPI, DerivedState, UserAction } from '@meshsdk/token-api';
import { useCallback, useEffect, useState } from 'react';
import { auditTime, distinctUntilChanged, Observable } from 'rxjs';

export const useSubscriptions = () => {
  const { hasConnectedWallet } = useAssets();
  const providers = useProviders();

  const deploy = useDeployedContracts();  
  const [tokenContractStates, setTokenContractStates] = useState<ContractState[]>([]);
  const [tokenDeploymentObservable, setTokenDeploymentObservable] = useState<Observable<ContractDeployment> | undefined>(
    undefined,
  );
  const [tokenDeployment, setTokenDeployment] = useState<ContractDeployment>();
  const [deployedAPI, setDeployedAPI] = useState<DeployedAPI>();
  const [derivedState, setDerivedState] = useState<DerivedState>();
  const [turnsState, setTurnsState] = useState<UserAction>();

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
    const subscriptionDerivedState = tokenDeployment.api.state$
      .pipe(auditTime(1000), distinctUntilChanged())
      .subscribe(setDerivedState);
    const subscriptionTurnsState = tokenDeployment.api.turns$
      .pipe(auditTime(1000), distinctUntilChanged())
      .subscribe(setTurnsState);
    return () => {
      subscriptionDerivedState.unsubscribe();
      subscriptionTurnsState.unsubscribe();
    };
  }, [tokenDeployment, setDeployedAPI]);

  return {
    tokenContractStates,
    tokenDeployment,
    deployedAPI,
    derivedState,
    turnsState
  };
};
