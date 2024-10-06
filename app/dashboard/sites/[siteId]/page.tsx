import prisma from '@/app/utils/db'
import { Button } from '@/components/ui/button'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { BookIcon, MoreHorizontal, PlusCircle, SettingsIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/app/components/dashboard/EmptyState'

//  
//  
// we want to fetch the data from the post model related to the siteId and also the userId
// we will get the user and site id through params and when called just passed as args
async function getData(userId: string, siteId: string) {
    try {
        const data = await prisma.post.findMany({
            where: {
                userId,
                siteId
            },
            select: {
                image: true,
                title: true,
                createdAt: true,
                id: true,
                site: {
                    select: {
                        subdirectory: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        //console.log('Fetched Data:', data);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

//server component->safe for async
//params of the siteId->relates to [siteId]
async function SiteIdRoute({ params, }: { params: { siteId: string } }) {

    //////////////////////////////////////REPLACE WITH SERVER ACTION COMPONENT requireUser.ts////////////////////////////////////
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
        return redirect("api/auth/login");
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //console.log('User ID:', user.id); // Check if user ID is correct
    //console.log('User ID in string:', user.id.toString()); // Check if user ID is correct
    //console.log('Site ID:', params.siteId); // Check if site ID is correct
    //console.log('prisma query returns below:')
    //console.log(await prisma.$queryRaw`SELECT "id", "siteId", "title" FROM "Post" WHERE "userId" = ${user.id} AND "siteId" = ${params.siteId};`)

    //Fetch the data from the post model related to the siteId and also the userId (dont think we need the toString but to be safe)
    const data = await getData(user.id.toString(), params.siteId.toString())
    //console.log('Data:', data); // Log fetched data

    return (
        <>
            {/* buttons */}
            <div className='flex w-full justify-end gap-x-4'>
                <Button variant={'secondary'} asChild>
                    {data.length > 0 && data[0]?.site && (
                        <Link href={`/blog/${data[0].site.subdirectory}`}><BookIcon className='mr-2 size-4' />View Blog</Link>
                    )}
                </Button>

                <Button variant={'secondary'} asChild>
                    <Link href={`/dashboard/sites/${params.siteId}/create`}><PlusCircle className='mr-2 size-4' />Create article</Link>
                </Button>

                <Button asChild>
                    <Link href={`/dashboard/sites/${params.siteId}/settings`}><SettingsIcon className='mr-2 size-4' />Settings</Link>
                </Button>
            </div>

            {/* default state for no posts made */}
            {data === undefined || data.length === 0 ? (
                <EmptyState title='There are no posts created just yet'
                    description='You are welcome to create some by clicking that enticing button below :)'
                    path={`/dashboard/sites/${params.siteId}/create`} />

            ) :
                // table displaying the posts made
                (
                    <div>
                        <Card className='min-w-[600px]'>
                            <CardHeader>
                                <CardTitle className='text-2xl'>Posts</CardTitle>
                                <CardDescription>Manage your posts in a simple and intuitive interface</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Image</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created At</TableHead>
                                            <TableHead className='text-right'>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Image src={item.image} alt={item.title} className='size-16 rounded-md object-cover' width={64} height={64} />
                                                </TableCell>
                                                <TableCell >{item.title}</TableCell>
                                                <TableCell><Badge className='bg-green-500/10 text-green-500' variant={'outline'}>Published</Badge></TableCell>
                                                <TableCell>{item.createdAt.toDateString()}</TableCell>
                                                <TableCell className="text-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="icon" variant="ghost">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/dashboard/sites/${params.siteId}/${item.id}`}>
                                                                    Edit</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/dashboard/sites/${params.siteId}/${item.id}/delete`}
                                                                ><span className='text-red-500'>Delete</span></Link>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )}
        </>
    )
}

export default SiteIdRoute