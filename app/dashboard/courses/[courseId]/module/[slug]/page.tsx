import React from "react";
import ClientModules from "@/app/components/dashboard/module/ClientModules";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { BackButton } from '@/app/components/BackButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RenderPost } from "@/app/components/dashboard/RenderPost";
import { JSONContent } from 'novel'; // Assuming JSONContent type aligns with RenderPost's requirements
import { Prisma } from "@prisma/client";
import { MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the default JSON content structure that RenderPost can handle
const defaultJSONContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Welcome! Add content here to display in this module." },
      ],
    },
  ],
};


async function getData(slug: string) {
  const foundModule = await prisma.module.findUnique({
    where: { slug },
    include: {
      resource: {
        include: { concept: true },
      },
    },
  });

  if (!foundModule) {
    throw new Error("Module not found");
  }

  await requireUser();
  // const admin = await prisma.user.findUnique({
  //   where: { id: user.id, role: "ADMIN" },
  // });

  // Enforce details as an object or use default JSON
  if (typeof foundModule.details === "object" && foundModule.details !== null) {
    foundModule.details = foundModule.details as Prisma.JsonObject;
  } else {
    foundModule.details = defaultJSONContent; // Assign default structure if it's missing or invalid
  }

  //return { foundModule, isAdmin: !!admin };
  return { foundModule };
}

// Server-side page
export default async function Modules({ params }: { params: { courseId: string, slug: string } }) {
  //const { foundModule, isAdmin } = await getData(params.slug);
  const { foundModule } = await getData(params.slug);
  const user = await requireUser();

  return (
    <>
      <header>
        <div className="flex flex-row align-middle items-center w-full justify-between">
          <BackButton path={`/dashboard/courses/${params.courseId}`} text="Back to Course" />
          <div className="flex flex-row gap-2">
            {/* {isAdmin && (
              <> 
                <Button asChild>
                  <Link href={`/dashboard/new/editcourse/${params.courseId}/editmodule/${params.slug}`}>Edit Module</Link>
                </Button>
                <Button asChild>
                  <Link href={`/dashboard/new/editcourse/${params.courseId}/editmodule/${params.slug}/addconcept`}>Add Concept</Link>
                </Button>
              {/* </>
            )} 
            <Button asChild>
              <Link href={`/dashboard/new/editcourse/${params.courseId}/editmodule/${params.slug}/addresource`}>Add Resource</Link>
            </Button>*/}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/new/editcourse/${params.courseId}/editmodule/${params.slug}`}>Edit Module</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/new/editcourse/${params.courseId}/editmodule/${params.slug}/addconcept`}>Add Concept</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/new/editcourse/${params.courseId}/editmodule/${params.slug}/addresource`}>Add Resource</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/courses/${params.courseId}/module/${params.slug}/quiz`}>Quizzes and Questions</Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="min-h-[250px] py-2 w-full">
        <RenderPost json={foundModule.details as JSONContent} />
      </div>

      <ClientModules
        userId={user.id}
        initialResources={foundModule.resource || []}
      />
    </>
  );
}
