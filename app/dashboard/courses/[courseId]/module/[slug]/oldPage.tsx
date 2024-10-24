// import { BackButton } from '@/app/components/BackButton';
// import AddResource from '@/app/components/dashboard/module/AddResource';
// import PDFs from '@/app/components/dashboard/module/PDFs';
// // import PDFViewer from '@/app/components/dashboard/PDFViewer';
// import prisma from '@/app/utils/db';
// import { requireUser } from '@/app/utils/requireUser';
// import { Resource } from '@/app/utils/types';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import Link from 'next/link';
// import React from 'react'



//  async function getData(slug: string) {
//   const module = await prisma.module.findUnique({
//     where: { slug: slug },
//     include: {
//       resource: {
//         include: { concept: true } //include the related concept for each resource
//       }
//     }, // Include related resources
//   });
//   return module;
// }

//  async function EditModuleButton({ slug, courseId }: { slug: string, courseId: string }) {
//   const user = await requireUser();
//   // Check if user is an admin
//   const admin = await prisma.user.findUnique({
//     where: {
//       id: user.id,
//       role: 'ADMIN',
//     },
//   });

//   if (admin) {
//     return (
//       <div className="">
//         <Button asChild>

//           <Link href={`/dashboard/new/editcourse/${courseId}/editmodule/${slug}`}>Edit Module</Link>
//         </Button>
//       </div>
//     );
//   }

//   // If not an admin, return null
//   return null;
// }

// async function Modules({ params }: { params: { courseId: string, slug: string } }) {
//   const moduleData = await getData(params.slug);

//   const textbooks: Resource[] = moduleData?.resource?.filter((res) => res.type === 'TEXTBOOK') || [];
//   const tutorialLetters: Resource[] = moduleData?.resource?.filter((res) => res.type === 'TUTORIAL_LETTER') || [];
//   const additionalResources: Resource[] = moduleData?.resource?.filter((res) => res.type === 'ADDITIONAL_RESOURCE') || [];
//   const youtubeLinks: Resource[] = moduleData?.resource?.filter((res) => res.type === 'YOUTUBE_LINK') || [];


//   const renderResourcesByConcept = (resources: Resource[]) => {
//     const groupedByConcept = resources.reduce<Record<string, Resource[]>>((acc, resource) => {
//       const conceptName = resource.concept?.name || 'No Concept'; // Handle null concept
//       if (!acc[conceptName]) {
//         acc[conceptName] = [];
//       }
//       acc[conceptName].push(resource);
//       return acc;
//     }, {});

//     return Object.keys(groupedByConcept).map((conceptName) => (
//       <div key={conceptName} className="mt-4">
//         <h2 className="text-xl font-semibold">{conceptName}</h2>
//         {groupedByConcept[conceptName].map((resource) => (
//           <div key={resource.id} className="mt-2">
//             <a href={resource.slug} target="_blank" rel="noopener noreferrer" className='hover:text-blue-500 hover:underline'>
//               {resource.name}
//             </a>
//           </div>
//         ))}
//       </div>
//     ));
//   };

//   return (
//     <>
//       <div>
//         {/* Title and buttons */}
//         <div className="flex flex-row align-middle items-center w-full justify-between">
//           <BackButton path={`/dashboard/courses/${params.courseId}`} text="Back to Course" />
//           <div className='flex flex-row gap-2'>
//             <EditModuleButton courseId={params.courseId.toString()} slug={params.slug.toString()} />
//             <AddResource moduleSlug={params.slug} />
//           </div>
//         </div>
//         <div className="text-center mt-4">
//           <h1 className="text-muted-foreground text-center text-3xl font-bold">{moduleData?.name}</h1>
//         </div>

//         {/* rest of page below title */}
//         <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full h-full mt-4">
//           <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">

//             {/* Textbook Resources */}
//             <div className="aspect-video md:aspect-square rounded-xl bg-muted/50 p-2 flex-col gap-2 overflow-y-auto text-center">
//               <h1 className="w-full text-center font-bold text-lg mt-2">Textbook Resources</h1>
//               {textbooks.length > 0 ? renderResourcesByConcept(textbooks) : <p>No textbooks available.</p>}
//             </div>

//             {/* Tutorial Letters */}
//             <div className="aspect-video md:aspect-square rounded-xl bg-muted/50 p-2 flex-col gap-2 overflow-y-auto text-center">
//               <h1 className="w-full text-center font-bold text-lg mt-2">Tutorial Letters</h1>
//               {tutorialLetters.length > 0 ? renderResourcesByConcept(tutorialLetters) : <p>No tutorial letters available.</p>}
//             </div>

//             {/* Additional Resources */}
//             <div className="aspect-video md:aspect-square rounded-xl bg-muted/50 p-2 flex-col gap-2 overflow-y-auto text-center">
//               <h1 className="w-full text-center font-bold text-lg mt-2">Additional Resources</h1>
//               {additionalResources.length > 0 ? renderResourcesByConcept(additionalResources) : <p>No additional resources available.</p>}
//             </div>

//             {/* YouTube Links */}
//             <div className="aspect-video md:aspect-square rounded-xl bg-muted/50 p-2 flex-col gap-2 overflow-y-auto text-center">
//               <h1 className="w-full text-center font-bold text-lg mt-2">YouTube Links</h1>
//               {youtubeLinks.length > 0 ? renderResourcesByConcept(youtubeLinks) : <p>No YouTube links available.</p>}
//             </div>
//           </div>
//           </div>
//           <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
//         </div>
//         </>
//         );
// }

//         export default Modules;




// async function Modules({ params }: { params: { courseId: string, slug: string } }) {
//   console.log("params.slug", params.slug)

//   const moduleData = await getData(params.slug);

//   console.log(moduleData?.resource)
//   // Separate the resources by their type
//   const textbooks = moduleData?.resource?.filter((res) => res.type === 'TEXTBOOK') || [];
//   const tutorialLetters = moduleData?.resource?.filter((res) => res.type === 'TUTORIAL_LETTER') || [];
//   const additionalResources = moduleData?.resource?.filter((res) => res.type === 'ADDITIONAL_RESOURCE') || [];
//   const youtubeLinks = moduleData?.resource?.filter((res) => res.type === 'YOUTUBE_LINK') || [];

//   return (
//     <>
//       {/* header */}
//       <div>
//         <div className="flex flex-row align-middle items-center w-full justify-between ">

//           <BackButton path={`/dashboard/courses/${params.courseId}`} text="Back to Course" />
//           <div className='flex flex-row gap-2'>
//           <EditModuleButton courseId={params.courseId.toString()} slug={params.slug.toString()} />
//           <AddResource moduleSlug={params.slug} />
//           </div>
//         </div>
//         <div className="text-center mt-4">
//           <h1 className="text-muted-foreground text-center text-3xl font-bold">{moduleData?.name}</h1>
//         </div>

//         {/* rest of page below title */}
//         <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full h-full mt-4">
//           <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">

//             {/* Textbook Resources */}
//             <div className="aspect-video md:aspect-square rounded-xl bg-muted/50 p-2 flex-col gap-2 overflow-y-auto text-center">
//               <h1 className="w-full text-center font-bold text-lg mt-2">Textbook Resources</h1>
//               {textbooks.length > 0 ? (
//                 textbooks.map((resource) => (
//                   <div key={resource.id} className=''>
//                     <a href={resource.slug} target="_blank" rel="noopener noreferrer" className='hover:text-blue-500 hover:underline'>
//                       {resource.name}
//                     </a>
//                   </div>
//                 ))
//               ) : (
//                 <p>No textbooks available.</p>
//               )}
//             </div>

//             {/* Tutorial Letters */}
//             <div className="aspect-video md:aspect-square rounded-xl bg-muted/50 p-2 flex-col gap-2 overflow-y-auto text-center">
//               <h1 className="w-full text-center font-bold text-lg mt-2">Tutorial Letters</h1>
//               {tutorialLetters.length > 0 ? (
//                 tutorialLetters.map((resource) => (
//                   <div key={resource.id}>
//                     <a href={resource.slug} target="_blank" rel="noopener noreferrer" className='hover:text-blue-500 hover:underline'>
//                        {resource.name}
//                     </a>
//                   </div>
//                 ))
//               ) : (
//                 <p>No tutorial letters available.</p>
//               )}
//             </div>

//             {/* Additional Resources */}
//             <div className="aspect-video md:aspect-square rounded-xl bg-muted/50 p-2 flex-col gap-2 overflow-y-auto text-center">
//               <h1 className="w-full text-center font-bold text-lg mt-2">Additional Resources</h1>
//               {additionalResources.length > 0 ? (
//                 additionalResources.map((resource) => (
//                   <div key={resource.id}>
//                     <a href={resource.slug} target="_blank" rel="noopener noreferrer" className='hover:text-blue-500 hover:underline'>
//                       {resource.name}
//                     </a>
//                   </div>
//                 ))
//               ) : (
//                 <p>No additional resources available.</p>
//               )}
//             </div>

//             {/* YouTube Links */}
//             <div className="aspect-video md:aspect-square rounded-xl bg-muted/50 p-2 flex-col gap-2 overflow-y-auto text-center">
//               <h1 className="w-full text-center font-bold text-lg mt-2">YouTube Links</h1>
//               {youtubeLinks.length > 0 ? (
//                 youtubeLinks.map((resource) => (
//                   <div key={resource.id}>
//                     <a href={resource.slug} target="_blank" rel="noopener noreferrer" className='hover:text-blue-500 hover:underline'>
//                       {resource.name}
//                     </a>
//                   </div>
//                 ))
//               ) : (
//                 <p>No YouTube links available.</p>
//               )}
//             </div>

//           </div>
//           <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
//         </div>
//       </div>
//     </>
//   );
// }



