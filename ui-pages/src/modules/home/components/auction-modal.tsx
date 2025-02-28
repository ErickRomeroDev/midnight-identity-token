import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EB_Garamond, IBM_Plex_Sans } from 'next/font/google';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ContractState } from '@/packages/midnight-contracts/auction';
import { useAuctionContractSubscription } from '@/modules/midnight-contracts/auction/hooks/use-contract-subscription';
import Image from 'next/image';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import Countdown from 'react-countdown';
import { STATE } from '@meshsdk/auction-contract';

export const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

interface AuctionModalProps {
  contracts: ContractState[];
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  index: number | undefined;
}

export const AuctionModal = ({ contracts, openDialog, setOpenDialog, index }: AuctionModalProps) => {
  const formSchema = z.object({
    name: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 0,
    },
  });

  const item = index !== undefined ? contracts[index] : undefined;
  const { contractDeployment, contractState, register } = useAuctionContractSubscription(item);

  const handleRegister = () => {
    try {
      register();
    } catch (e: any) {
      toast.error(e);
    }
  };

  const deadlineString = contractState?.info.deadline;

  // Convert string to Date object safely
  const deadlineDate = useMemo(() => (deadlineString ? dayjs(deadlineString).toDate() : null), [deadlineString]);

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <span className="text-[18px] text-red-500">Expired</span>;
    } else {
      return (
        <span className="text-[18px] text-[#D28C13]">
          {String(days).padStart(2, '0')}:{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </span>
      );
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      form.reset();
    } catch {}
  };

  return (
    <>
      {item && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent
            className={`${ebGaramond.variable} ${ibmPlexSans.className} border-[0.5px] border-white/20 bg-white/20 backdrop-blur-[20px]`}
          >
            <DialogHeader>
              <DialogDescription>
                <div className="">
                  <div className="relative h-[270px]">
                    <div className="absolute z-10 h-full w-full bg-[#0E1B2E]/40" />
                    <h1 className="absolute bottom-4 left-6 z-20 font-[family-name:var(--font-eb-garamond)] text-[26px] text-white">
                      {contractState?.info.title}
                    </h1>
                    {contractState?.info.image && (
                      <Image
                        className="pointer-events-none h-full w-full rounded-t-[5px] object-cover"
                        src={contractState.info.image}
                        alt="sample"
                        width={300}
                        height={300}
                      />
                    )}
                  </div>
                  <div className="space-y-4 px-6 pb-10 pt-4 text-white">
                    <div className="flex justify-between font-[family-name:var(--font-eb-garamond)] text-base">
                      <div>
                        <h2 className="text-[18px]">Ends In:</h2>
                        <p className="text-[18px] text-[#D28C13]">
                          {deadlineDate ? (
                            <Countdown date={deadlineDate} renderer={renderer} />
                          ) : (
                            <p className="text-[18px] text-red-500">Invalid date</p>
                          )}
                        </p>
                      </div>
                      <div className="text-end">
                        <h2 className="text-[18px]">Highest Bid:</h2>
                        <p className="text-[18px] text-[#D28C13]">
                          {contractState?.highestBid.toString()}
                          {'  '}tBid
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-x-2 text-[14px] leading-snug">
                      <div>Contract:</div>
                      <div className="flex gap-x-2">
                        <div className="">
                          {contractDeployment?.address &&
                            `${contractDeployment.address.slice(0, 15)}...${contractDeployment.address.slice(-15)}`}
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Image
                                className="cursor-pointer"
                                onClick={() => {
                                  contractDeployment?.address && navigator.clipboard.writeText(contractDeployment.address);
                                  toast.success('Contract address copied!');
                                }}
                                src="/copy-white.svg"
                                alt="copy"
                                width={12}
                                height={12}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Copy contract</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="flex gap-x-2 text-[14px] leading-snug">
                      <div>Estimate:</div>
                      <div>{contractState?.info.description}</div>
                    </div>
                  </div>

                  {contractState?.state === STATE.active && (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex items-center justify-between px-6 pb-10">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="">
                                <FormLabel className=""></FormLabel>
                                <FormControl>
                                  <Input className="w-[200px] placeholder:text-center" placeholder="0,000 tBID" {...field} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-[140px] rounded-[4px] bg-gradient-to-r from-[#D26608] to-[#D28C13] font-normal transition-all hover:from-[#E07318] hover:to-[#E29E35]"
                          >
                            Place Bid
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                  {contractState?.state === STATE.open && (
                    <div className="flex w-full justify-center items-center pb-10">
                      <Button
                        onClick={handleRegister}
                        className="w-[140px] rounded-[4px] bg-gradient-to-r from-[#D26608] to-[#D28C13] font-normal transition-all hover:from-[#E07318] hover:to-[#E29E35]"
                      >
                        Register now
                      </Button>
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
