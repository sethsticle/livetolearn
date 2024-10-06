//loading screens for buttons etc
"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
    text: string
    className?: string
    variant?: "secondary" | "destructive" | "link" | "ghost" | "outline" | "default" | null | undefined

}

export function SubmitButton({text, className, variant}: SubmitButtonProps) {
   
   const {pending} = useFormStatus()
   console.log("Form status is pending: ", pending);

    return (
        <>
            {pending ? (
               <Button 
               className={cn("w-fit", className)} 
               variant={variant} 
               type='submit' disabled>
                   <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Almost there...
                   </Button>
            ) : (
                <Button 
                className={cn("w-fit", className)} 
                variant={variant} 
                type='submit'>
                    {text}
                </Button>
            )}
        </>
    )
}