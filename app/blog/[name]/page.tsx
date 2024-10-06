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

    return (
        <>
            {/* header nav and toggle */}
            
            <div className="flex items-center justify-between py-4  mb-4">
                {/* Left: Back Button */}
                <BackButton path={`/dashboard`} />

                {/* Center: Logo and Blog Title */}
                <nav className="flex items-center gap-x-4 justify-center">
                    <Image src={Logo} alt="Logo" width={40} height={40} />
                    <h1 className="text-3xl font-semibold tracking-tight">{data.name}</h1>
                </nav>

                {/* Right: Theme Toggle */}
                <div className="flex justify-end">
                    <ThemeToggle />
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