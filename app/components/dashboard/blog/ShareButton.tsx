// ShareButton.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareIcon, Copy } from "lucide-react"; // Import the icons from Lucide
import { toast } from "sonner"; // Import your toast notification library

export default function ShareButton({ url }: { url: string }) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Blog URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy URL");
      console.log(err)
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <ShareIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Blog URL
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
