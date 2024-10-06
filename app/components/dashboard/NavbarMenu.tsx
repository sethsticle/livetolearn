// components/DropdownMenu.tsx
'use client'; // Only this component is client-side

import {  MenuIcon } from 'lucide-react'; // Optional icon
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Import Button from ShadCN's library
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


export default function NavbarMenu() {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button   size="icon">
                <MenuIcon className=' h-4 w-4' />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
            <DropdownMenuLabel className='text-primary'>Pages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/dashboard">
                    <span className='text-muted-foreground'>Dashboard</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/dashboard/sites">
                    <span className='text-muted-foreground'>Sites</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/dashboard/pricing">
                    <span className='text-muted-foreground'>Pricing</span>
                </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}
