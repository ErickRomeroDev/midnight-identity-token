import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useDeployedContracts, useProviders } from '@/packages/midnight-contracts/auction';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useAuctionContractsSubscriptions } from '@/modules/midnight-contracts/auction/hooks/use-contracts-subscriptions';
import { ContractPage } from '@/modules/home/components/admin-contracts';
import { api } from '@/utils/api';

const Admin = () => {
  const deploy = useDeployedContracts();
  const { auctionContractDeployments, auctionContractDeployments_refresh } = useAuctionContractsSubscriptions();
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

  useEffect(() => {
    if (providers?.flowMessage) {
      toast.info(providers.flowMessage, {
        id: 'flowMessageToast', // Use a fixed ID to avoid duplicates
        duration: Infinity,
      });
    }
  }, [providers?.flowMessage]);

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
    <div className="pt-[70px] text-white">
      <h1>Admin Page</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-between px-6 pb-10">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className=""></FormLabel>
                  <FormControl>
                    <Input className="w-[200px] placeholder:text-center" placeholder="title" {...field} />
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
                <FormItem className="">
                  <FormLabel className=""></FormLabel>
                  <FormControl>
                    <Input className="w-[200px] placeholder:text-center" placeholder="description" {...field} />
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
                <FormItem className="">
                  <FormLabel className=""></FormLabel>
                  <FormControl>
                    <Input className="w-[200px] placeholder:text-center" placeholder="minBid" {...field} />
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
                <FormItem className="">
                  <FormLabel className=""></FormLabel>
                  <FormControl>
                    <Input className="w-[200px] placeholder:text-center" placeholder="end date" {...field} />
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
                <FormItem className="">
                  <FormLabel className=""></FormLabel>
                  <FormControl>
                    <Input className="w-[200px] placeholder:text-center" placeholder="image" {...field} />
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
              Create Auction
            </Button>
          </div>
        </form>
      </Form>
      {auctionContractDeployments.map((contract, id) => (
        <ContractPage key={id} contract={contract} />
      ))}
    </div>
  );
};
export default Admin;
