"use client"
import { Course, ModuleType } from '@/app/utils/types'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash } from 'lucide-react';
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";


export default function ModuleCardDisplay({ courseData }: { courseData: Course }) {
    const [modules, setModules] = useState<ModuleType[]>(courseData?.module || []); // Use initial courseData.modules


    const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null); // Track module to delete


    const handleDeleteModule = async () => {
        if (deleteModuleId) {
            //await DeleteModuleAction({ moduleId: deleteModuleId });
            setModules(modules.filter((mod) => mod.id !== deleteModuleId)); // Remove from the state
            setDeleteModuleId(null); // Close the modal
        }
    };


    return (
        <div className='flex flex-col min-h-60 lg:min-h-[650px] h-full w-full items-center justify-center overflow-y-auto border border-muted-foreground/20 rounded-lg shadow-md'>
            <div className="">
                {/* Display Existing Modules */}
               <div className=''> <h1 className='font-bold text-lg text-center'>Modules</h1></div>
                <div className="">

                    {modules.map((mod) => (
                        <div key={mod.id} className='my-2'>
                            <Card className="p-4 flex justify-between max-h-[120px] overflow-hidden w-full">
                                <div>
                                    <h3 className="font-semibold">{mod.name}</h3>
                                    <p>{mod.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    {/* Edit Module Icon
                                    <Button variant="ghost" asChild>
                                        <Link href={`/dashboard/new/editcourse/${courseId}/editmodule/[slug]/page.tsx`}></Link><Edit className="w-5 h-5" />
                                    </Button> */}
                                    {/* Delete Module Icon */}
                                    <Button variant="ghost" onClick={() => setDeleteModuleId(mod.id)}>
                                        <Trash className="w-5 h-5 text-red-500" />
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Delete Confirmation Modal*/}
            <Dialog open={!!deleteModuleId} onOpenChange={() => setDeleteModuleId(null)}>
                <DialogContent>
                    <DialogHeader>
                         <DialogTitle>I dont think we should be letting just anyone delete modules tbh</DialogTitle> {/*Are you sure you want to delete this module? */}
                            <p className='tracking-tight'>But if its really bugging you, you can delete it for now..might be here when you get back though</p>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDeleteModuleId(null)}>Sure</Button>
                        <Button variant="destructive" onClick={handleDeleteModule}>Argh!</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
