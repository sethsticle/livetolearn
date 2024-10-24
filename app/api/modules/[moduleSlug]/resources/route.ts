import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function GET(req: Request, { params }: { params: { moduleSlug: string } }) {
    // Find the module by the moduleSlug
    const module = await prisma.module.findUnique({
        where: { slug: params.moduleSlug },
        include: {
            resource: {
                include: { concept: true }, // Fetch each resource and include its related concept
            }
        }
    });

    // If no module is found, return a 404 error
    if (!module) {
        return NextResponse.json({ message: "Module not found" }, { status: 404 });
    }

    // Return the resources of the module
    return NextResponse.json(module.resource, {
        headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
    });
}
