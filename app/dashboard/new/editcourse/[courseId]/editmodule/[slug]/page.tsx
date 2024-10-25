
import { BackButton } from '@/app/components/BackButton'
import EditModuleForm from '@/app/components/dashboard/new/editcourse/EditModuleForm'
import LoadingScreen from '@/app/components/LoadingScreen'
import prisma from '@/app/utils/db'
import { ModuleType } from '@/app/utils/types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import React, { Suspense } from 'react'


export default function LoadingEditModuleRoute({ params }: { params: { courseId: string, slug: string } }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <EditModuleRoute params={params} />
    </Suspense>
  )
}

async function getModuleData(slug: string) {
  const foundModule = await prisma.module.findUnique({
    where: { slug: slug },
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      year: true,
      details: true,
    },
  });
  return foundModule as ModuleType;

}

async function EditModuleRoute({ params }: { params: { courseId: string, slug: string } }) {

  const foundModuleData = await getModuleData(params.slug);

  return (

    <>
     <div>
            <header className='justify-between items-center flex gap-2 w-full'>
                <BackButton path={`/dashboard/courses/${params.courseId}/module/${params.slug}`} text='Back to module'/>
                <Button variant="default" asChild>
                    <Link href={`/dashboard/new/editcourse/${params.courseId}/editmodule/${params.slug}/addconcept`}>Add Concept</Link>
                </Button>
                
            </header>

            <div className='w-full h-full px-8 py-4'>
                 
                <EditModuleForm moduleData={foundModuleData} moduleSlug={params.slug} courseId={params.courseId} />
            </div>
            
            
            
        </div></>
  )
}

