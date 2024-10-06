import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
    text?: string;
    path: string;
    additionalClass?: string;
}

export function BackButton({ text, path, additionalClass }: BackButtonProps) {
    return (
        <div className={`flex items-center gap-2 ${additionalClass} hover:cursor-pointer`}>
            <Button asChild size="icon">
                <Link href={path}>
                    <ArrowLeft className="size-4 " />
                </Link>
            </Button>
            <h1 className="text-2xl font-semibold">{text}</h1>
        </div>
    )
}