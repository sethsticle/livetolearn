"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card} from '@/components/ui/card';
import { Trash, Edit } from 'lucide-react';
import { Course, ModuleType } from '@/app/utils/types'; // Ensure types are imported


export default function AddModuleCard({ courseData }: { courseData: Course }) {
    const [modules] = useState<ModuleType[]>(courseData?.module || []); // Use initial courseData.modules
    //const [modules, setModules] = useState<Module[]>(courseData?.module || []); // Use initial courseData.modules

    // const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null); // Track module to delete
    
//     // Unique state for AddModuleCard
//   const [lastResultAdd, actionAdd] = useFormState(AddModuleAction, undefined);
//   const [formAdd, fieldsAdd] = useForm({
//     lastResult: lastResultAdd,
//     onValidate({ formData }) {
//       return parseWithZod(formData, { schema: moduleSchema });
//     },
//     shouldValidate: "onBlur",
//     shouldRevalidate: "onInput",
//   });

    // const handleAddModule = (newModule: Module) => {
    //     setModules([...modules, newModule]);
    // };

    // const handleDeleteModule = async () => {
    //     if (deleteModuleId) {
    //         await DeleteModuleAction({ moduleId: deleteModuleId });
    //         setModules(modules.filter((mod) => mod.id !== deleteModuleId)); // Remove from the state
    //         setDeleteModuleId(null); // Close the modal
    //     }
    // };
// const formId = `add-module-form-${courseId}`;

    return (
        <div className='w-full'>
        <div className="flex w-full h-full flex-row gap-2">
            {/* Add Module Form
            <Card className='max-w-[450px]'>
                <CardHeader className=' flex gap-2 text-center'>
                    <CardTitle>Add New Module</CardTitle>
                    <CardDescription>
                        Add or remove the course's modules here and click &apos;Save&apos; to confirm!
                    </CardDescription>
                </CardHeader>
                <form id={formId} onSubmit={formAdd.onSubmit} action={actionAdd}>
                    <input type="hidden" name="courseId" value={courseId} />
                    <CardContent className="grid gap-6">
                        <Input name={fieldsAdd.name.name} placeholder="Module Name" />
                        <p className="text-red-500 text-sm">{fieldsAdd.name.errors}</p>

                        <Textarea name={fieldsAdd.description.name} placeholder="Module Description" />
                        <p className="text-red-500 text-sm">{fieldsAdd.description.errors}</p>

                        <Input name={fieldsAdd.slug.name} placeholder="Module Slug" />
                        <p className="text-red-500 text-sm">{fieldsAdd.slug.errors}</p>
                    </CardContent>
                    <CardFooter className='justify-center'>
                        <FormSubmitButton formId={formId} text='Save' />
                    </CardFooter>
                </form>
            </Card> */}

            {/* Display Existing Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border border-green-500">

                {modules.map((mod) => (
                    <Card key={mod.id} className="p-4 flex justify-between max-h-[120px] overflow-hidden">
                        <div>
                            <h3 className="font-semibold">{mod.name}</h3>
                            <p>{mod.description}</p>
                        </div>
                        <div className="flex gap-2">
                            {/* Edit Module Icon */}
                            <Button variant="ghost">
                                <Edit className="w-5 h-5" />
                            </Button>
                            {/* Delete Module Icon */}
                            <Button variant="ghost" onClick={() => {}}> {/* setDeleteModuleId(mod.id) */}
                            
                                <Trash className="w-5 h-5 text-red-500" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
            {/* Delete Confirmation Modal*/}
            {/*<Dialog open={!!deleteModuleId} onOpenChange={() => setDeleteModuleId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this module?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDeleteModuleId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteModule}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
        </div>
    );
}
