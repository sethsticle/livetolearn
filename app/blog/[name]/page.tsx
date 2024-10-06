import { ThemeToggle } from "@/app/components/dashboard/ThemeToggle";
import prisma from "@/app/utils/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import Logo from "@/public/logo.png";
import Defaultimage from "@/public/2.png";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BackButton } from "@/app/components/BackButton";
import ShareButton from "@/app/components/dashboard/blog/ShareButton";


//obtain the subdirectory from the params and fetch the data from the database
async function getData(subDir: string) {
    const data = await prisma.site.findUnique({
        where: {
            subdirectory: subDir,
        },
        select: {
            name: true,
            posts: {
                select: {
                    smallDescription: true,
                    title: true,
                    image: true,
                    createdAt: true,
                    slug: true,
                    id: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!data) {
        return notFound();
    }

    return data;
}

export default async function BlogRoute({ params }: { params: { name: string } }) {
    const data = await getData(params.name);


    // Generate the correct base URL depending on the environment
    const baseUrl = 'www.planetseth.xyz'

        // typeof window !== 'undefined'
        //     ? window.location.origin // If client-side
        //     : process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000" // If server-side (for Vercel)

    const fullUrl = `${baseUrl}/blog/${params.name}`;


    return (
        <>
            {/* header nav and toggle */}

            <div className="flex items-center justify-between py-4  mb-4">
                {/* Left: Back Button */}
                <div>
                    <BackButton path={`/dashboard`} />
                </div>

                <div>
                    {/* Center: Logo and Blog Title */}
                    <nav className="flex items-center gap-x-4 justify-center">
                        <Image src={Logo} alt="Logo" width={40} height={40} />
                        <h1 className="text-3xl font-semibold tracking-tight">{data.name}</h1>
                    </nav>
                </div>

                <div>
                    {/* Right: Theme Toggle */}
                    <div className="flex gap-2 justify-end">
                        <ShareButton url={fullUrl} />
                        <ThemeToggle />
                    </div>

                </div>
            </div>


            {/* posts */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                {data.posts.map((item) => (
                    <Card key={item.id}>
                        <Image
                            src={item.image ?? Defaultimage}
                            alt={item.title}
                            className="rounded-t-lg object-cover w-full h-[200px]"
                            width={400}
                            height={200}
                        />
                        <CardHeader>
                            <CardTitle className="truncate">{item.title}</CardTitle>
                            <CardDescription className="line-clamp-3">
                                {item.smallDescription}
                            </CardDescription>
                        </CardHeader>

                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/blog/${params.name}/${item.slug}`}>
                                    Read more
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

        </>
    )
}