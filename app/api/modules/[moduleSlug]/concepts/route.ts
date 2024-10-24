import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function GET(req: Request, { params }: { params: { moduleSlug: string } }) {
  
  console.log('Module slug received in API:', params.moduleSlug);
  // Find module by slug
  const foundModule = await prisma.module.findUnique({
    where: { slug: params.moduleSlug },
    select: { id: true }, // Only fetch the id
  });

  if (!foundModule) {
    return NextResponse.json({ message: "Module not found" }, { status: 404 });
  }

  // Find concepts related to this module
  const concepts = await prisma.concept.findMany({
    where: { moduleId: module.id }, // Use moduleId
    include: { resources: true }, // Include resources associated with the concept
  });
  console.log("Concepts from API: ", concepts)

  return NextResponse.json(concepts, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}