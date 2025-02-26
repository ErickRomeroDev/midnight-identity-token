import { AuctionCard } from '@/modules/home/components/auction-card';
import { AuctionModal } from '@/modules/home/components/auction-modal';
import { api } from '@/utils/api';
import { useState } from 'react';

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

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  const chunkedData = chunkArray(data, 3);

  return (
    <div className="relative flex flex-col h-[calc(100vh-70px)] justify-center mt-[70px]">
      <AuctionModal openDialog={openDialog} setOpenDialog={setOpenDialog} index={index} />
      <div className="absolute bottom-0 -z-10 h-[45%] w-full bg-[#3E4858]" />
      <div className="border">Search bar</div>

      <div className="flex flex-col items-center space-y-16 h-[60%] w-full overflow-y-auto snap-y snap-mandatory border border-pink-400 pt-16">
        {chunkedData.map((group, rowIndex) => (
          <div key={rowIndex} className=" snap-center">
            <div className="grid grid-cols-3 gap-x-10">
              {group.map((item, colIndex) => (
                <AuctionCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  estimate={item.estimate}
                  index={rowIndex * colIndex}
                  setIndex={setIndex}
                  setOpenDialog={setOpenDialog}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="h-20" />
      </div>

      {/* <div className="flex flex-col items-center h-[60%] w-full overflow-y-auto border border-pink-400 pt-16">
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
        <div className="h-20"/>
      </div> */}
    </div>
  );
};

export default Auctions;
