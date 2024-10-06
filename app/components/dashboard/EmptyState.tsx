import { Button } from "@/components/ui/button";
import { FileIcon, PlusCircle } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
    title: string;
    description: string;
    path: string;
}

export function EmptyState({ title, description, path }: EmptyStateProps) {
    return (
        <div className='flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50'>
            <div className='flex size-20 items-center justify-center rounded-full bg-primary/10'>
                <FileIcon className='size-10 text-primary' />
            </div>
            <h2 className='mt-6 font-semibold'>{title}</h2>
            <p className='mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground max-w-sm mx-auto'>{description}</p>
            <Button asChild><Link href={path}>
                <PlusCircle className='mr-2 size-4' />Take me there! </Link></Button>
        </div>
    )
}