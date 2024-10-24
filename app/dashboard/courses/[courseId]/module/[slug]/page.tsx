import React from "react";
import ClientModules from "@/app/components/dashboard/module/ClientModules";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";

// Server-side data fetching
export async function getData(slug: string) {
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

  return (
    <>
      {/* You no longer need Suspense here for route loading */}
      <ClientModules
        courseId={params.courseId}
        initialResources={foundModule?.resource || []}
        moduleSlug={params.slug}
        isAdmin={isAdmin}
      />
    </>
  );
}
