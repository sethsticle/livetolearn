import { DeleteSiteAction } from "@/app/actions";
import { BackButton } from "@/app/components/BackButton";
import { UploadImageForm } from "@/app/components/dashboard/forms/UploadImageForm";
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";




export default function SettingsRoute({params}: {params: {siteId: string}}) {
    return (
       <>
        {/* back button */}
        <BackButton path={`/dashboard/sites/${params.siteId}`} text='View Posts' />


        <UploadImageForm siteId={params.siteId} />

        <Card className="border-red-500 bg-red-500/10 ">
                <CardHeader>
                    <CardTitle className="text-red-500">Danger</CardTitle>
                    <CardDescription className="mt-2">This is a trechourous zone...take caution here...pushing this button deletes EVERYTHING</CardDescription>
                </CardHeader>  
                <CardFooter>
                    <form action={DeleteSiteAction}>
                    <input type="hidden" name="siteId" value={params.siteId} /> {/* using this to store the current siteId that is being viewed for deletion*/}
                    <SubmitButton variant={'destructive'} text="Delete Site, and all it's posts" />
                    </form>
                </CardFooter>              
        </Card>
           

       </>
       
    )
}