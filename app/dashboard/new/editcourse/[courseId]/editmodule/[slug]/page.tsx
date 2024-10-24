import { BackButton } from '@/app/components/BackButton'
import EditCourseForm from '@/app/components/dashboard/new/editcourse/EditCourseForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function EditModuleRoute({ params }: { params: { courseId: string, slug: string } }) {
  return (
    <>
     <div>
            <header className='justify-between items-center flex gap-2 w-full'>
                <BackButton path={`/dashboard/courses/${params.courseId}/module/${params.slug}`} text='Back to module'/>
                <Button variant="default" asChild>
                    <Link href={`/dashboard/new/editcourse/${params.courseId}/editmodule/${params.slug}/addconcept`}>Add Concept</Link>
                </Button>
                
            </header>
            
            
            
        </div></>
  )
}

export default EditModuleRoute