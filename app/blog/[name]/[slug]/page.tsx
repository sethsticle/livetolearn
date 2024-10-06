import { BackButton } from "@/app/components/BackButton";
import { RenderPost } from "@/app/components/dashboard/RenderPost";
import { ThemeToggle } from "@/app/components/dashboard/ThemeToggle";
import prisma from "@/app/utils/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JSONContent } from "novel";


async function getData(slug: string) {
    const data = await prisma.post.findUnique({
        where: {
            slug: slug,
        },
        select: {
            postContent: true,
            title: true,
            smallDescription: true,
            image: true,
            createdAt: true,
        },
    });

    if (!data) {
        return notFound();
    }

    return data;
}

export default async function SlugRoute({ params }: { params: { name: string, slug: string } }) {
    const data = await getData(params.slug);

    return (
        <>
            {/* back button */}
            <div className="flex items-center gap-x-3 pt-10 pb-5 justify-between">
                <BackButton path={`/blog/${params.name}`} text="Back to Blog" />
                <div>
                    
                    <ThemeToggle />
                </div>
            </div>

             

            {/* date, title and description */}
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="m-auto w-full text-center md:w-7/12 ">
                    <p className="m-auto my-5 w-10/12 text-sm font-light text-muted-foreground md:text-base">{data.createdAt.toDateString()}</p>
                    <h1 className="text-3xl font-semibold tracking-tight">{data.title}</h1>
                    <p className="text-sm font-light text-muted-foreground md:text-base mt-4 line-clamp-3">{data.smallDescription}</p>
                    
                </div>

            </div>
            {/* image */}
            <div className="relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden rounded-md md:mb-20 md:h-[450px] md:w-5/6 md:rounded-2xl lg:w-2/3">
                <Image src={data.image} alt={data.title} 
                className="object-cover w-full h-full" 
                width={1200} height={630}
                priority/>
            </div>

            {/* rich text */}
            <div>
                <RenderPost json={data.postContent as JSONContent} />
            </div>
        </>
    );
}