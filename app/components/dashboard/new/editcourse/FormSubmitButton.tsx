
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

interface FormSubmitButtonProps {
  text: string;
  formId: string;
  className?: string;
  variant?: "secondary" | "destructive" | "link" | "ghost" | "outline" | "default" | null | undefined;
}


//lol lets just pretend this isnt here...its messy i know
export function FormSubmitButton({ text, formId, className, variant }: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  console.log("Form status is pending: ", pending);

  return (
    <>
      {pending ? (
        <Button
          className={cn("w-fit", className)}
          variant={variant}
          type="button"
          disabled
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Almost there...
        </Button>
      ) : (
        <Button
          className={cn("w-fit", className)}
          variant={variant}
          type="button"
          onClick={() => {
            const formElement = document.getElementById(formId) as HTMLFormElement;
            if (formElement) {
              formElement.submit(); // Trigger the form submission
            }
          }}
        >
          {text}
        </Button>
      )}
    </>
  );
}
