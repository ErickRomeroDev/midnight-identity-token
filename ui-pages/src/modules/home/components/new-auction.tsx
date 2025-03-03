import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { ContractState, useDeployedContracts, useProviders } from '@/packages/midnight-contracts/auction';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { Subscription } from 'rxjs';

interface ManageAuctionsProps {
  auctionContractDeployments: ContractState[];
  auctionContractDeployments_refresh: () => Subscription;
}

export const NewAuction = ({ auctionContractDeployments, auctionContractDeployments_refresh }: ManageAuctionsProps) => {
  const deploy = useDeployedContracts();
  const providers = useProviders();
  const [deploymentStatus, setDeploymentStatus] = useState<'deploying' | 'deploying-done' | 'deploying-error' | undefined>(
    undefined,
  );
  const { mutate } = api.postTable.postSmartContract.useMutation();

  useEffect(() => {
    if (deploymentStatus === 'deploying') {
      toast.info('deploying auction contract');
    }
    if (deploymentStatus === 'deploying-done') {
      toast.dismiss(); // Remove previous messages
      toast.info('deployment done');
    }
  }, [deploymentStatus]);

  const formSchema = z.object({
    title: z.string(),
    description: z.string(),
    minBid: z.coerce.number(),
    endDate: z.string(),
    image: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      minBid: 0,
      endDate: '',
      image: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (deploy) {
        setDeploymentStatus('deploying');
        const contract = await deploy.deployAndAddContract(
          'recent',
          values.title,
          values.description,
          values.minBid,
          values.endDate,
          values.image,
        );
        setDeploymentStatus('deploying-done');
        if (contract.address) {
          mutate({ smartContract: contract.address });
        }
        console.log('smart contract Address', contract.address);
      }
      form.reset();
      auctionContractDeployments_refresh();
    } catch {
      setDeploymentStatus('deploying-error');
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-2 items-center justify-between">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>
                  <div className="pl-2 text-white/70 text-[12px]">Title</div>
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-[250px] border-none rounded-[3px] bg-[#3E4858] placeholder:pl-3"
                    placeholder="title"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>
                  <div className="pl-2 text-white/70 text-[12px]">Description</div>
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-[250px] border-none rounded-[3px] bg-[#3E4858] placeholder:pl-3"
                    placeholder="description"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minBid"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>
                  <div className="pl-2 text-white/70 text-[12px]">Min Bid</div>
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-[250px] border-none rounded-[3px] bg-[#3E4858] placeholder:pl-3"
                    placeholder="minBid"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>
                  <div className="pl-2 text-white/70 text-[12px]">Deadline</div>
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-[250px] border-none rounded-[3px] bg-[#3E4858] placeholder:pl-3"
                    placeholder="end date"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>
                  <div className="pl-2 text-white/70 text-[12px]">Cover Image</div>
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-[250px] border-none rounded-[3px] bg-[#3E4858] placeholder:pl-3"
                    placeholder="image"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-4">
            <Button
              type="submit"
              className="w-[250px] rounded-[4px] bg-gradient-to-r from-[#D26608] to-[#D28C13] font-normal transition-all hover:from-[#E07318] hover:to-[#E29E35]"
            >
              Create Auction
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
