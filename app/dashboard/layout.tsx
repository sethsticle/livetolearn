import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DashboardItems from "../components/dashboard/DashboardItems"
import { Home, DollarSign, Globe, CircleUser } from 'lucide-react'
import { ThemeToggle } from '../components/dashboard/ThemeToggle'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import NavbarMenu from "../components/dashboard/NavbarMenu";

export const navLinks = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    // {
    //     name: "Courses",
    //     href: "/dashboard/courses",
    //     icon: Globe,
    // },
    // {
    //     name: "Modules",
    //     href: "/dashboard/modules",
    //     icon: DollarSign,
    // },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (

        <section className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
            <div className='hidden border-r bg-muted/40 md:block '>  {/*on small screens we dont show */}
                <div className='flex h-full max-h-screen flex-col gap-2 fixed  '>

                    <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 gap-2 overflow-hidden text-nowrap  '>
                        <Image src={'/2.png'} alt='logo' width={32} height={32} />
                        <Link href='/'>
                            <h3 className='text-3xl'> <span className='text-primary'>Live</span> to <span className='text-primary'>Learn</span></h3>
                        </Link>
                    </div>

                    <div className='flex-1'>
                        <nav className='grid items-start px-2 font-medium lg:px-4'>
                            <DashboardItems />
                        </nav>
                    </div>

                </div>
            </div>



            <div className='flex flex-col'>
                <header className='sticky top-0 flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
                    <div className='md:hidden '>
                        <NavbarMenu />
                    </div>
                    
                    <div className='ml-auto flex items-center gap-5'>

                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" className='rounded-full' size="icon">
                                    <CircleUser />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem>
                                    <LogoutLink>Logout</LogoutLink>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
                    {children}
                </main>
            </div>
        </section>
    )
}