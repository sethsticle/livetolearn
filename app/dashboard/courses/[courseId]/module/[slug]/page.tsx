import React, { Suspense } from "react";
import ClientModules from "@/app/components/dashboard/module/ClientModules";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";

// Server-side data fetching
export async function getData(slug: string) {
  const module = await prisma.module.findUnique({
    where: { slug: slug },
    include: {
      resource: {
        include: { concept: true },
      },
    },
  });

  if (!module) {
    throw new Error('Module not found');
  }

  const user = await requireUser();
  const admin = await prisma.user.findUnique({
    where: {
      id: user.id,
      role: 'ADMIN',
    },
  });

  return { module, isAdmin: !!admin };
}

// Server-side page
export default async function Modules({ params }: { params: { courseId: string, slug: string } }) {
  const { module, isAdmin } = await getData(params.slug);

  return (
    <>
      {/* You no longer need Suspense here for route loading */}
      <ClientModules
        courseId={params.courseId}
        initialResources={module?.resource || []}
        moduleSlug={params.slug}
        isAdmin={isAdmin}
      />
    </>
  );
}
