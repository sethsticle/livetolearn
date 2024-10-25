import React from "react";
import ClientModules from "@/app/components/dashboard/module/ClientModules";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { BackButton } from '@/app/components/BackButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RenderPost } from "@/app/components/dashboard/RenderPost";
import { JSONContent } from 'novel';

// Helper function for server-side data fetching
async function getData(slug: string) {
  const foundModule = await prisma.module.findUnique({
    where: { slug: slug },
    include: {

      resource: {
        include: { concept: true },
      },
    },
  });

  if (!foundModule) {
    throw new Error('Module not found');
  }

  const user = await requireUser();
  const admin = await prisma.user.findUnique({
    where: {
      id: user.id,
      role: 'ADMIN',
    },
  });

  return { foundModule, isAdmin: !!admin };
}

// Server-side page
export default async function Modules({ params }: { params: { courseId: string, slug: string } }) {
  const { foundModule, isAdmin } = await getData(params.slug);
  // foundModule.details = foundModule.details ? JSON.parse(foundModule.details as string) : {};
  const user = await requireUser();
  return (
    <>
      <header>
        <div className="flex flex-row align-middle items-center w-full justify-between">
          <BackButton path={`/dashboard/courses/${params.courseId}`} text="Back to Course" />
          <div className='flex flex-row gap-2'>
            {isAdmin && (<>
              
              <Button asChild><Link href={`/dashboard/new/editcourse/${params.courseId}/editmodule/${params.slug}`}>Edit Module</Link></Button>
              <Button asChild><Link href={`/dashboard/new/editcourse/${params.courseId}/editmodule/${params.slug}/addconcept`}>Add Concept</Link></Button>
              </>
            )}
            <Button asChild><Link href={`/dashboard/new/editcourse/${params.courseId}/editmodule/${params.slug}/addresource`}>Add Resource</Link></Button>
          </div>
        </div>
      </header>


      <div className=' min-h-[250px] py-2 w-full'>
        <RenderPost json={foundModule?.details as JSONContent} />
      </div>

      {/* You no longer need Suspense here for route loading */}
      <ClientModules
        userId={user.id}
        // courseId={params.courseId}
        initialResources={foundModule?.resource || []}
        // moduleSlug={params.slug}
        // isAdmin={isAdmin}

      />
    </>
  );
}
