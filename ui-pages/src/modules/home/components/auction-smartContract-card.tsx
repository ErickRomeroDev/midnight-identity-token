import { useAuctionContractSubscription } from "@/modules/midnight-contracts/auction/hooks/use-contract-subscription";
import { ContractState } from "@/packages/midnight-contracts/auction";
import { STATE } from "@meshsdk/auction-contract";

interface AuctionSmartContractCardProps {
  contract: ContractState;
  setIndex: (index: number | undefined) => void;
  index: number | undefined;
  setOpenDialog: (open: boolean) => void;
}

export const AuctionSmartContractCard = ({
  contract,
  setIndex,
  setOpenDialog,
  index,
}: AuctionSmartContractCardProps) => {
  const { contractDeployment, contractState } = useAuctionContractSubscription(contract);
  return (
    <div
      className="relative h-[370px] w-[270px] cursor-pointer"
      onClick={() => {        
        setIndex(index);
        setOpenDialog(true);
      }}
    >
      <div className="absolute left-3 top-2 rounded-[3px] bg-white/10 px-2 py-0.5 text-[15px] text-white backdrop-blur-md">
        Closed
      </div>
      <div className="absolute bottom-0 h-fit w-full space-y-2 rounded-b-[5px] bg-white/20 p-2.5 backdrop-blur-lg">
        <h2 className="font-[family-name:var(--font-eb-garamond)] text-[18px] text-white">
          {contractDeployment?.address}          
        </h2>  
        <div>{contractState?.state === STATE.open && "Open"}</div> 
        <div>{contractState?.state === STATE.active && "Active"}</div>  
        <div>{contractState?.state === STATE.closed && "Closed"}</div>       
      </div>  
      
    </div>
  );
};
