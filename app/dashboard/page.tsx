import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { EmptyState } from "../components/dashboard/EmptyState";
  import prisma from "../utils/db";
  import { requireUser } from "../utils/requireUser";
  import Image from "next/image";
  import Defaultimage from "@/public/2.png";
  import { Button } from "@/components/ui/button";
  import Link from "next/link";
  
  async function getData(userId: string) {
    const [sites, posts] = await Promise.all([
      prisma.site.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
      }),
      prisma.post.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
      }),
    ]);
  
    return { sites, posts };
  }
  
  export default async function DashboardIndexPage() {
    const user = await requireUser();
    const { posts, sites } = await getData(user.id);
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-5">Your Sites</h1>
        {sites.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {sites.map((item) => (
              <Card key={item.id}>
                <Image
                  src={item.imageUrl ?? Defaultimage}
                  alt={item.name}
                  className="rounded-t-lg object-cover w-full h-[200px]"
                  width={400}
                  height={200}
                />
                <CardHeader>
                  <CardTitle className="truncate">{item.name}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {item.description}
                  </CardDescription>
                </CardHeader>
  
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/sites/${item.id}`}>
                      View posts
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Oh no! You dont have any sites created"
            description="Not to worry. Please create some so that you can see them right here."
            path="/dashboard/sites/new"
          />
        )}
  
        <h1 className="text-2xl mt-10 font-semibold mb-5">Recent posts</h1>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {posts.map((item) => (
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
                    <Link href={`/dashboard/sites/${item.siteId}/${item.id}`}>
                      Edit Article
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Oh no! You dont have any posts just yet"
            description="Not to worry, click that button below to create some."
            path="/dashboard/sites"
          />
        )}
      </div>
    );
  }