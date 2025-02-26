import { useAuctionContractSubscription } from '@/modules/midnight-contracts/auction/hooks/use-contract-subscription';
import { ContractState } from '@/packages/midnight-contracts/auction';
import { useAssets } from '@/packages/midnight-react';
import { STATE } from '@meshsdk/auction-contract';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ContractPageProps {
  contract: ContractState;
}

export const ContractPage = ({ contract }: ContractPageProps) => {
  const { contractDeployment, contractState, start_auction, close_auction, list_register, list_confirmed, register, set_myId1, set_myId2, set_myId3, set_myId4, approve_certificates, bid } =
    useAuctionContractSubscription(contract);
  const { coinPublicKey } = useAssets();
  const [list_register_, setList_register_] = useState<(string | undefined)[] | undefined>(undefined);
  const [list_confirmed_, setList_confirmed_] = useState<(string | undefined)[] | undefined>(undefined);

  useEffect(() => {
    if (contractState?.userAction?.action === 'opening-bid') {
      toast.info('opening Auction');
    }
    if (contractState?.userAction?.action === 'opening-done') {
      toast.dismiss(); // Remove previous messages
      toast.info('Auction was opened');
    }

    if (contractState?.userAction?.action === 'closing-bid') {
      toast.info('closing Auction');
    }
    if (contractState?.userAction?.action === 'closing-done') {
      toast.dismiss(); // Remove previous messages
      toast.info('Auction was closed');
    }
    console.log(contractState?.userAction.action);
  }, [contractState]);

  useEffect(() => {
    const list_register_ = list_register();
    setList_register_(list_register_);
  }, [list_register]);

  useEffect(() => {
    const list_confirmed_ = list_confirmed();
    setList_confirmed_(list_confirmed_);
  }, [list_confirmed]);

  return (
    <div className="py-2">
      <div>Address: {contractDeployment?.address}</div>
      <div className="flex">
        State of the contract:{' '}
        {contractState?.state === STATE.open ? (
          <div className="cursor-pointer" onClick={start_auction}>
            Start Contract
          </div>
        ) : contractState?.state === STATE.active ? (
          <div className="cursor-pointer" onClick={close_auction}>
            Close Contract
          </div>
        ) : (
          'Contract is closed'
        )}
      </div>
      <div>Am i the owner?: {contractState?.owner && (toHex(contractState?.owner.bytes) === coinPublicKey).toString()}</div>
      <div>Registered Certificates: {list_register_ && list_register_.toString()}</div>
      <div>Confirmed Certificates: {list_confirmed_ && list_confirmed_.toString()}</div>
      <div onClick={register}> Registrar no BID</div>
      <div onClick={set_myId1}>Set My ID1</div>
      <div onClick={set_myId2}>Set My ID2</div>
      <div onClick={set_myId3}>Set My ID3</div>
      <div onClick={set_myId4}>Set My ID4</div>
      <div onClick={() => approve_certificates(["e90936a4daa108d901e3b5793c095d70d64397d80a8ffc6e378882302a3d31f6"])}> Approve Certificates</div>
      <div onClick={() => bid(11)}> Make Bid</div>  
      <div>Contract Title: {contractState?.info.title}</div> 
      <div>Contract Description: {contractState?.info.description}</div>  
      <div>Contract MinBid: {contractState?.info.minBid.toString()}</div>   
      <div>Contract Deadline: {contractState?.info.deadline}</div> 
      <div>Contract Image: {contractState?.info.image}</div>   
    </div>
  );
};
