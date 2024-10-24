"use client"
import { DeleteModuleAction } from '@/app/actions';
import { Course, Module } from '@/app/utils/types'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash } from 'lucide-react';
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";


export default function ModuleCardDisplay({ courseData }: { courseData: Course }) {
    const [modules, setModules] = useState<Module[]>(courseData?.module || []); // Use initial courseData.modules


    const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null); // Track module to delete


    const handleDeleteModule = async () => {
        if (deleteModuleId) {
            await DeleteModuleAction({ moduleId: deleteModuleId });
            setModules(modules.filter((mod) => mod.id !== deleteModuleId)); // Remove from the state
            setDeleteModuleId(null); // Close the modal
        }
    };


    return (
        <div className='flex flex-col h-full w-full items-center justify-center overflow-y-auto'>
            <div className="">
                {/* Display Existing Modules */}
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
                        <DialogTitle>Are you sure you want to delete this module?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDeleteModuleId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteModule}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
