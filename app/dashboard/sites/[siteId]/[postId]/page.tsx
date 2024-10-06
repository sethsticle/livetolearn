import { EditPostForm } from "@/app/components/dashboard/forms/EditPostForm";
import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JSONContent } from "novel";


//fetch some post data to edit...we only need the postId as we are in the edit route
//fetching data means server component so no client side working here !
async function getData(postId: string) {
    const data = await prisma.post.findUnique({
        where: {
            id: postId,
        },
        select: {
            image: true,
            title: true,
            smallDescription: true,
            slug: true,
            postContent: true,
            id: true,
        }, 
        
    })

    //validating in case of something not found
    if(!data){
        return notFound()
    }
    
    //console.log('Fetched Data:', data); // Log the data being fetched

    return {
        ...data,
        postContent: data?.postContent as JSONContent, // Casting the `JsonValue` to `JSONContent`
      };
}
//we call the getData function and pass the postId as a param
//postId is the name of the dynamic route param meaning we get the data from the url
//siteId for returning to the site page
export default async function EditRoute({params}:{params:{ postId: string, siteId: string}}) {
    const data = await getData(params.postId)

    //console.log('Data:', data); // Log fetched data

    return (
        <div>
            <div className="flex items-center gap-2">
                <Button asChild size="icon">
                    <Link href={`/dashboard/sites/${params.siteId}`}>
                        <ArrowLeft className="size-4 " />
                    </Link>
                </Button>
                <h1 className="text-2xl font-semibold">Edit Post</h1>
            </div>
            <EditPostForm data={data} siteId={params.siteId} />
        </div>
    )
}