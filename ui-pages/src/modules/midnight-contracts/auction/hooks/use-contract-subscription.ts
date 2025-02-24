import { ContractState, ContractDeployment } from '@/packages/midnight-contracts/auction';
import { DeployedAPI, DerivedState } from '@meshsdk/auction-api';
import { useEffect, useState } from 'react';
import { auditTime } from 'rxjs';

export const useAuctionContractSubscription = (auctionContractState: ContractState) => {
  const [contractDeployment, setContractDeployment] = useState<ContractDeployment>();
  const [deployedContractAPI, setDeployedContractAPI] = useState<DeployedAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [contractState, setContractState] = useState<DerivedState>();
  const [isLoading, setIsLoading] = useState(!!auctionContractState.observable);

  useEffect(() => {
    if (!auctionContractState.observable) {
      return;
    }
    const subscription = auctionContractState.observable.subscribe(setContractDeployment);

    return () => {
      subscription.unsubscribe();
    };
  }, [auctionContractState.observable]);

  useEffect(() => {
    if (!contractDeployment) {
      return;
    }
    if (contractDeployment.status === 'in-progress') {
      return;
    }
    setIsLoading(false);

    if (contractDeployment.status === 'failed') {
      setErrorMessage(
        contractDeployment.error.message.length ? contractDeployment.error.message : 'Encountered an unexpected error.',
      );
      return;
    }
    setDeployedContractAPI(contractDeployment.api);
    const subscription = contractDeployment.api.state$.pipe(auditTime(1000)).subscribe(setContractState);
    return () => {
      subscription.unsubscribe();
    };
  }, [contractDeployment, setIsLoading, setErrorMessage, setDeployedContractAPI]); 

  
  return {
    contractDeployment,
    deployedContractAPI,
    errorMessage,
    contractState,
    isLoading
  };
};
