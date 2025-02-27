import { AuctionSmartContractCard } from '@/modules/home/components/auction-smartContract-card';
import { AuctionSmartContractModal } from '@/modules/home/components/auction-smartContract-modal';
import { ContractState, useDeployedContracts } from '@/packages/midnight-contracts/auction';
import { api } from '@/utils/api';
import { useCallback, useEffect, useState } from 'react';

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  return arr.reduce((acc: T[][], _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);
};

const Auctions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [index, setIndex] = useState<number | undefined>(undefined);
  const { data, isLoading } = api.getTable.getMany.useQuery();
  const { data: dataSmartContracts, isLoading: isLoadingSmartContracts } = api.getTable.getSmartContracts.useQuery();
  const deploy = useDeployedContracts();
  const [auctionContractDeployments, setAuctionContractDeployments] = useState<ContractState[]>([]);

  const auctionContractDeployments_refresh = useCallback(() => {
    if (dataSmartContracts) {
      dataSmartContracts.forEach((item) => {
        deploy.addContract('recent', item.smartContract);
      });
      const subscription = deploy.contractDeployments$.subscribe((newDeployments) => {
        console.log('New contract deployments received:', newDeployments);
        setAuctionContractDeployments(newDeployments);
      });
      return subscription;
    }
  }, [deploy, dataSmartContracts]);

  useEffect(() => {
    const subscription = auctionContractDeployments_refresh();
    if (subscription) {
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [auctionContractDeployments_refresh]);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (isLoadingSmartContracts || !dataSmartContracts) {
    return <div>Loading...</div>;
  }

  const chunkedData = chunkArray(auctionContractDeployments, 3);

  return (
    <div className="relative flex flex-col h-[calc(100vh-70px)] justify-center mt-[70px]">
      <AuctionSmartContractModal openDialog={openDialog} setOpenDialog={setOpenDialog} index={index} contracts={auctionContractDeployments} />
      <div className="absolute bottom-0 -z-10 h-[45%] w-full bg-[#3E4858]" />
      <div className="border">Search bar</div>

      <div className="flex flex-col items-center space-y-16 h-[60%] w-full overflow-y-auto snap-y snap-mandatory border border-pink-400 pt-16">
        {chunkedData.map((group, rowIndex) => (
          <div key={rowIndex} className=" snap-center">
            <div className="grid grid-cols-3 gap-x-10">
              {group.map((item, colIndex) => (
                <AuctionSmartContractCard
                  key={rowIndex * colIndex + colIndex}                  
                  contract={item}
                  index={rowIndex * colIndex + colIndex}
                  setIndex={setIndex}
                  setOpenDialog={setOpenDialog}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="h-20" />
      </div>
    </div>
  );
};

export default Auctions;
