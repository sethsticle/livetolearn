// "use client"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import React, { useEffect, useState } from 'react'
// import { useFormState } from 'react-dom'
// import { useForm } from '@conform-to/react'
// import { parseWithZod } from '@conform-to/zod'
// import { SubmitButton } from '@/app/components/dashboard/SubmitButtons'
// import { FAQItem } from '@/app/components/dashboard/FAQSection'


// function EditFAQRoute({params}: {params: {courseId: string}}) {

//     const [faqData, setFaqData] = useState<FAQItem[]>([]);

//     // Fetch FAQ data from the JSON file
//     useEffect(() => {
//       const fetchFAQ = async () => {
//         const response = await import("@/app/utils/FAQ/course/faq.json");
//         setFaqData(response.default);
//       };
//       fetchFAQ();
//     }, []);


//   //get the 'status' of the serveraction and action->createSiteAction
//   const [lastResult, action] = useFormState(AddModuleAction, undefined)
//     //^^ this will keep track fo the form data
//     //we now want to set up conform on the client side
//     const [form, fields] = useForm({
//         //pass the status of the serverAction
//         lastResult,
//         //here we are validating the data on the client side
//         onValidate({formData}){
//             return parseWithZod(formData, {
//                 schema: moduleSchema
//             })
//         },
//         //so we want to now tell conform when to validate
//         shouldValidate: "onBlur", // this will validate when we lose input..another words clicking outside the text entering area
//         shouldRevalidate: "onInput" // this will revalidate on input
//     })


//     return (
//         <div className='flex flex-col flex-1 items-center justify-center'>
      
//        <Card className='max-w-[450px]'>
//                 <CardHeader className=' flex gap-2 text-center'>
//                     <CardTitle>Add New Module</CardTitle>
//                     <CardDescription>
//                         Add course modules here and click &apos;Save&apos; to confirm!
//                     </CardDescription>
//                 </CardHeader>
//                 <form id={form.id} onSubmit={form.onSubmit} action={action}>
//                     <input type="hidden" name="courseId" value={params.courseId} />
//                     <CardContent className="grid gap-6">
//                         <Input name={fields.name.name}  key={fields.name.name} placeholder="Module Name" />
//                         <p className="text-red-500 text-sm">{fields.name.errors}</p>

//                         <Textarea name={fields.description.name}  key={fields.description.name} placeholder="Module Description" />
//                         <p className="text-red-500 text-sm">{fields.description.errors}</p>

//                         <Input name={fields.slug.name} key={fields.slug.name} placeholder="Module Slug" />
//                         <p className="text-red-500 text-sm">{fields.slug.errors}</p>
//                     </CardContent>
//                     <CardFooter className='justify-center'>
//                         <SubmitButton text='Save' />
//                     </CardFooter>
//                 </form>
//             </Card>
//     </div>
//     )

// }