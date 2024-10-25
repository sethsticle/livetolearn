import { BackButton } from '@/app/components/BackButton'
import FAQSection from '@/app/components/dashboard/FAQSection'
import { RenderPost } from '@/app/components/dashboard/RenderPost'
import LoadingScreen from '@/app/components/LoadingScreen'
import prisma from '@/app/utils/db'
import { requireUser } from '@/app/utils/requireUser'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import { JSONContent } from 'novel'
import React, { Suspense } from 'react'

// Fetch course data (this will also include modules)
async function getData(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { 
      module: {
        orderBy: { year: 'asc' }, // Order modules by year

      }
    }, // Include related modules
  //   where: { id: courseId },
  //   include: {
  //     module: {
  //       orderBy: { year: 'asc' }, // Order modules by year
  //     },
  //   }, 
  // });
  });
  return course;
}


//Database needs a UNISALink to each course and each module
//this needs to be added to the database but i am lazy so we will work without it for now
//all things that need to be converted from frontend to database: 
//courseInfoTable
//Rules and Purpose Statement

const courseInfoTable = [
  {
    label: "Qualification Code",
    value: "98906",
  },
  {
    label: "NQF Level",
    value: "7",
  },
  {
    label: "Total Credits",
    value: "360",
  },
  {
    label: "SAQA ID",
    value: "804666",
  },
  {
    label: "APS",
    value: "20",
  },
];

export default async function CourseIdRouteIndexPage({ params }: { params: { courseId: string } }) {
  await requireUser(); // Check if user is authenticated

  return (
      <div className="flex flex-col items-center justify-center">
        <Suspense fallback={<LoadingScreen/>}>
          <CourseIdRoute params={params} /> {/* Pass params to CourseIdRoute */}
        </Suspense>
      </div>
  );
}



async function CourseIdRoute({ params }: { params: { courseId: string } }) {

  const courseData = await getData(params.courseId.toString())

  return (
    <>


      <div className='flex flex-col  h-full w-full gap-8 items-center mb-4'>

        {/* header */}
        <div className='flex flex-row align-middle w-full justify-between'>
          <BackButton path='/dashboard' />
          <div className=' text-center'>
            <h1 className='text-muted-foreground text-center text-3xl font-bold'>{courseData?.name}</h1>
            <p className='text-sm text-muted-foreground'>{courseData?.degreeCode}</p>
          </div>
          {/* Edit Course button for admins */}
          <EditCourseButton courseId={params.courseId.toString()} />
        </div>

        {/* info table */}
        <div className='w-1/2 border-2 border-muted-foreground rounded-lg'>
          <Table className=''>
            <TableBody>
              {courseInfoTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium max-w-10">{row.label}</TableCell>
                  <TableCell className='justify-end max-w-2'>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

          <div className=' w-full min-h-[250px] py-2' >
              <RenderPost json={courseData?.details as JSONContent} />
          </div>




        {/* List of Modules */}
        <div className="flex flex-col w-full md:w-3/4 lg:w-1/2 border rounded-lg bg-muted/40 shadow-lg px-2">

          {/* Display modules */}
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                <TableHead className="">Module</TableHead>
                <TableHead>Code(slug)</TableHead>
                <TableHead className='text-center'>Description</TableHead>
                <TableHead className="text-center">Jump-to</TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {courseData?.module?.map((mod) => (
                <TableRow key={mod.id}>
                  <TableCell>{mod.name}</TableCell>
                  <TableCell>{mod.slug}</TableCell>
                  <TableCell >{mod.description}</TableCell>
                  <TableCell >
                    <Button asChild variant={"outline"}><Link href={`/dashboard/courses/${mod.courseId}/module/${mod.slug}`}>View Module</Link></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className=' w-full'>
          <FAQSection />
        </div>
      </div>

    </>
  )
}

async function EditCourseButton({ courseId }: { courseId: string }) {
  const user = await requireUser();

  // Check if user is an admin
  const admin = await prisma.user.findUnique({
    where: {
      id: user.id,
      role: 'ADMIN',
    },
  });

  if (admin) {
    return (
      <div className=" ">
        <Button asChild>
          <Link href={`/dashboard/new/editcourse/${courseId}`}>Edit Course</Link>
        </Button>
      </div>
    );
  }

  // If not an admin, return null
  return null;
}
