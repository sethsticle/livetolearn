import { BackButton } from '@/app/components/BackButton';
import AddModuleCard from '@/app/components/dashboard/new/editcourse/AddModuleCard';
import EditCourseForm from '@/app/components/dashboard/new/editcourse/EditCourseForm';
import ModuleCardDisplay from '@/app/components/dashboard/new/editcourse/ModuleCardDisplay';
import prisma from '@/app/utils/db';
import { Course } from '@/app/utils/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

async function getCourseData(courseId: string) {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { module: true }, // Include related modules
    });
    return course as Course;
}

async function EditCourseRoute({ params }: { params: { courseId: string } }) {
    const courseData = await getCourseData(params.courseId);

    return (

        <div>
            <header className='justify-between items-center flex gap-2 w-full'>
                <BackButton path={`/dashboard/courses/${params.courseId}`} />
                <Button variant="default" asChild>
                    <Link href={`/dashboard/new/editcourse/${params.courseId}/addmodule`}>Add Module</Link>
                </Button>
            </header>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-full w-full  items-center p-2'>
                <div className=' col-span-2'><EditCourseForm courseData={courseData} courseId={params.courseId} /></div>
                <div className=' h-full'><ModuleCardDisplay courseData={courseData} courseId={params.courseId} /></div>

            </div>

            
        </div>
    );
}

export default EditCourseRoute;

