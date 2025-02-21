import { AuctionCard } from "@/modules/home/components/auction-card";
import { AuctionModal } from "@/modules/home/components/auction-modal";
import { Header } from "@/modules/home/components/header";
import { api } from "@/utils/api";
import { useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

const Auctions = () => {
  
  const [openDialog, setOpenDialog] = useState(false);

  const [index, setIndex] = useState<number | undefined>(undefined);
  
  const { data, isLoading } = api.getTable.getMany.useQuery();

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex h-screen items-end justify-center pt-[70px]">
      <AuctionModal openDialog={openDialog} setOpenDialog={setOpenDialog} index={index}/>
      <Header />
      <div className="absolute bottom-0 -z-10 h-[45%] w-full bg-[#3E4858]" />
      <div className="flex justify-center h-[calc(100vh-70px)] w-full overflow-y-auto border pt-20 border-pink-400">
        <div className="w-fit grid grid-cols-3 gap-x-10 gap-y-16 ">
          {data.map((item, index) => (
            <AuctionCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              estimate={item.estimate}
              index={index}
              setIndex={setIndex}
              setOpenDialog={setOpenDialog}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Auctions;
