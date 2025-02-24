import { useDeployedContracts, ContractState, useLocalState } from '@/packages/midnight-contracts/auction';
import { useEffect, useState } from 'react';


export const useAuctionContractsSubscriptions = () => {
  const localState = useLocalState();
  const deploy = useDeployedContracts();
  const [auctionContractDeployments, setAuctionContractDeployments] = useState<ContractState[]>([]);

  useEffect(() => {
    localState.getContracts().forEach((contractAddress) => {
      deploy.addContract('recent', contractAddress);
    });
    const subscription = deploy.contractDeployments$.subscribe(setAuctionContractDeployments);

    return () => {
      subscription.unsubscribe();
    };
  }, [deploy, localState]);  

  
  return {
    auctionContractDeployments,    
  };
};
