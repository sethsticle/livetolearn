import { DeletePostAction } from "@/app/actions";
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DeleteRoute({params}: {params: {siteId: string, postId: string}}) {
    return (
        <div className="flex items-center justify-center flex-1">
            <Card className="max-w-xl p-6">
                <CardHeader className=" flex gap-2 text-center">
                    <CardTitle>
                        Are you absolutely sure?
                    </CardTitle>
                    <CardDescription>
                       This action cannot be undone !
                    </CardDescription>
                </CardHeader>
                <CardFooter className="w-full justify-between flex">
                    <Button variant={'secondary'} asChild>
                       <Link href={`/dashboard/sites/${params.siteId}`}>Cancel</Link> 
                    </Button>
                    <form action={DeletePostAction}>
                    {/* this is for the delete action in action.ts */}
                    <input type="hidden" name="postId" value={params.postId} />
                    <input type="hidden" name="siteId" value={params.siteId} />
                    <SubmitButton variant={'destructive'} text="Delete" />
                       
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}