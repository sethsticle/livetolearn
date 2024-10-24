
// export default function AddResource({ moduleSlug, onResourceAdded }: { moduleSlug: string, onResourceAdded: () => Promise<void> }) {
//     const [lastResult, action] = useFormState(AddResourceAction, undefined);
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [concepts, setConcepts] = useState<Concept[]>([]);

//     useEffect(() => {
//         // Fetch available concepts for this module
//         async function fetchConcepts() {
//             const res = await fetch(`/api/modules/${moduleSlug}/concepts`);
//             const data: Concept[] = await res.json();
//             setConcepts(data); // Set the concepts here
//             console.log("Fetched concepts from AddResource.tsx: ", data); // Log the fetched data
//         }
//         fetchConcepts();
//     }, [moduleSlug]);

//     const [form, fields] = useForm({
//         lastResult,
//         onValidate({ formData }) {
//             return parseWithZod(formData, {
//                 schema: resourceSchema,
//             });
//         },
//         shouldValidate: "onBlur",
//         shouldRevalidate: "onInput",
//     });

//     // Use effect to check for submission success and close the dialog
//     useEffect(() => {
//         if (lastResult?.status === 'success') {
//             setIsDialogOpen(false);
//             toast.success('Resource added successfully!');
//             onResourceAdded();  // Trigger the parent to refetch resources
//         } else if (lastResult?.status === 'error') {
//             toast.error('There was an error adding the resource.');
//         }
//     }, [lastResult, onResourceAdded]);


//     // Handle form submission and manual dialog closing
//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const result = await form.onSubmit(e); // Manually trigger form submission

//         if (result?.status === 'success') {
//             setIsDialogOpen(false); // Close dialog after successful submission
//             toast.success('Resource added successfully!');
//             await onResourceAdded(); // Trigger the parent to refetch resources
//         } else if (result?.status === 'error') {
//             toast.error('There was an error adding the resource.');
//         }
//     };

//     return (
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//                 <Button onClick={() => setIsDialogOpen(true)}>Add Resource</Button>
//             </DialogTrigger>

//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Add New Resource</DialogTitle>
//                 </DialogHeader>

//                 <form id={form.id} onSubmit={form.onSubmit} action={action}>
//                     <input type="hidden" name="moduleSlug" value={moduleSlug} />

//                     <Input name={fields.name.name} placeholder="Resource Name" key={fields.name.name} />
//                     <p className="text-red-500 text-sm">{fields.name.errors || lastResult?.error?.slug}</p>

//                     <Input name={fields.link.name} placeholder="Resource Link" key={fields.link.name} />
//                     <p className="text-red-500 text-sm">{fields.link.errors}</p>

//                     {/* Select Dropdown for Type */}
//                     <select name={fields.type.name} key={fields.type.name} className="mt-2 p-2 border rounded">
//                         <option value="">Select Resource Type</option>
//                         <option value="TEXTBOOK">Textbook</option>
//                         <option value="TUTORIAL_LETTER">Tutorial Letter</option>
//                         <option value="ADDITIONAL_RESOURCE">Additional Resource</option>
//                         <option value="YOUTUBE_LINK">YouTube Link</option>
//                     </select>
//                     <p className="text-red-500 text-sm">{fields.type.errors}</p>

//                     {/* Select Dropdown for Concept */}
//                     <select name="conceptId" className="mt-2 p-2 border rounded">
//                         <option value="">Select Concept</option>
//                         {concepts.map((concept) => (
//                             <option key={concept.id} value={concept.id}>
//                                 {concept.name}
//                             </option>
//                         ))}
//                     </select>


//                     <Textarea name={fields.description.name} placeholder="Resource Description" key={fields.description.name} />
//                     <p className="text-red-500 text-sm">{fields.description.errors}</p>

//                     <DialogFooter>
//                         <SubmitButton text='Save' />
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }
