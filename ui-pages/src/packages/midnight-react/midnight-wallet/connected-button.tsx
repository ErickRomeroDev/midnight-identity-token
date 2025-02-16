import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAssets, useWallet } from "../hooks";

export default function ConnectedButton() {
  const { disconnect } = useWallet();
  const { address } = useAssets();

  return (
    <>
      {address && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">
              {address.slice(0, 6)}...{address.slice(-6)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>            
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(address);
              }}
            >
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                disconnect();
              }}
            >
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
