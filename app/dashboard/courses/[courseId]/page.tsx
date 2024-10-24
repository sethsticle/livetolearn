import { BackButton } from '@/app/components/BackButton'
import FAQSection from '@/app/components/dashboard/FAQSection'
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
import React, { Suspense } from 'react'

// Fetch course data (this will also include modules)
export async function getData(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { module: true }, // Include related modules
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
        <Suspense fallback={<div>Loading course data...</div>}>
          <CourseIdRoute params={params} /> {/* Pass params to CourseIdRoute */}
        </Suspense>
      </div>
  );
}



export  async function CourseIdRoute({ params }: { params: { courseId: string } }) {

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


        <div className="w-full px-8">
          <h2>Rules</h2>
          <ul className="list-disc list-inside">
            <li>Must have daily access to a computer with a stable internet connection.</li>
            <li>Must have passed Computer Application Technology or Information Technology with a rating of 4 (new NSC) or passed Computer Studies (old Senior Certificate).</li>
            <li>Alternatively, hold an Industry Standard qualification like ICDL in Computer Literacy.</li>
            <li>Students not meeting this requirement are advised to complete EUP1501 before starting the qualification.</li>
            <li>Completion of the Unisa First-Year Experience MOOC (FYE MOOC 101) is required.</li>
          </ul>
        </div>

        <div className="w-full px-8">
          <h2>Purpose Statement</h2>
          <ul className="list-disc list-inside">
            <li>Develop a systematic and coherent body of knowledge in computing.</li>
            <li>Understand and apply computing concepts and principles in the workplace.</li>
            <li>Gain strong cognitive, problem-solving, and communication skills.</li>
            <li>Build competence in accessing and evaluating scientific information.</li>
            <li>Apply knowledge through basic research and practice.</li>
            <li>Gain personal intellectual growth and contribute to science and technology in society.</li>
          </ul>
        </div>
        <div className="w-full px-8">
          <h2>Purpose Statement</h2>
          <ul className="list-disc list-inside">
            <li>Develop a systematic and coherent body of knowledge in computing.</li>
            <li>Understand and apply computing concepts and principles in the workplace.</li>
            <li>Gain strong cognitive, problem-solving, and communication skills.</li>
            <li>Build competence in accessing and evaluating scientific information.</li>
            <li>Apply knowledge through basic research and practice.</li>
            <li>Gain personal intellectual growth and contribute to science and technology in society.</li>
          </ul>
        </div>



        {/* List of Modules */}
        <div className="flex flex-col w-1/2 border rounded-lg bg-muted/40 shadow-lg">

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

export async function EditCourseButton({ courseId }: { courseId: string }) {
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
      <div className="mt-4">
        <Button asChild>
          <Link href={`/dashboard/new/editcourse/${courseId}`}>Edit Course</Link>
        </Button>
      </div>
    );
  }

  // If not an admin, return null
  return null;
}
