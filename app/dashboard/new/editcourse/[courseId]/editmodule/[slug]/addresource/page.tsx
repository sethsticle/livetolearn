"use client";
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AddResourceAction } from '@/app/actions';
import { useFormState } from 'react-dom';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { resourceSchema } from '@/app/utils/zodSchema';
import { Concept } from '@prisma/client';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitButton } from '@/app/components/dashboard/SubmitButtons';
import { BackButton } from '@/app/components/BackButton';



export default function AddResource({ params }: { params: { courseId: string, slug: string } }) {
    const [lastResult, action] = useFormState(AddResourceAction, undefined);
    const [concepts, setConcepts] = useState<Concept[]>([]);

    useEffect(() => {
        console.log("Slug passed to fetch concepts:", params.slug);  // Log slug
        async function fetchConcepts() {
            const res = await fetch(`/api/modules/${params.slug}/concepts`);
            if (!res.ok) {
                console.error('Failed to fetch concepts:', res.statusText);
                return;
            }
            const data: Concept[] = await res.json();
            setConcepts(data);
        }
        fetchConcepts();
    }, [params.slug]);

    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: resourceSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

   

    return (
        <div className='flex flex-col w-full h-full'>
            <div><BackButton path={`/dashboard/courses/${params.courseId}/module/${params.slug}`} text='Cancel' /></div>
            <div className="flex flex-col flex-1 items-center justify-center">
                <Card className="max-w-[450px]">
                    <CardHeader className="flex gap-2 text-center">
                        <CardTitle>Add New Resource</CardTitle>
                        <CardDescription>Add resources for the module here and click 'Save' to confirm!</CardDescription>
                    </CardHeader>

                    <form id={form.id} onSubmit={form.onSubmit} action={action}>
                        <input type="hidden" name="moduleSlug" value={params.slug} />
                        <input type="hidden" name="courseId" value={params.courseId} />

                        <CardContent>
                            <Input name={fields.name.name} placeholder="Resource Name" key={fields.name.name} />
                            <p className="text-red-500 text-sm">{fields.name.errors || lastResult?.error?.slug}</p>

                            <Input name={fields.link.name} placeholder="Resource Link" key={fields.link.name} />
                            <p className="text-red-500 text-sm">{fields.link.errors}</p>

                            <select name={fields.type.name} key={fields.type.name} className="mt-2 p-2 border rounded">
                                <option value="">Select Resource Type</option>
                                <option value="TEXTBOOK">Textbook</option>
                                <option value="TUTORIAL_LETTER">Tutorial Letter</option>
                                <option value="ADDITIONAL_RESOURCE">Additional Resource</option>
                                <option value="YOUTUBE_LINK">YouTube Link</option>
                            </select>
                            <p className="text-red-500 text-sm">{fields.type.errors}</p>

                            <select name="conceptId" className="mt-2 p-2 border rounded">
                                <option value="">Select Concept</option>
                                {Array.isArray(concepts) && concepts.length > 0 ? (
                                    concepts.map((concept) => (
                                        <option key={concept.id} value={concept.id}>
                                            {concept.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No Concepts Available</option>
                                )}
                            </select>

                            <Textarea name={fields.description.name} placeholder="Resource Description" key={fields.description.name} />
                            <p className="text-red-500 text-sm">{fields.description.errors}</p>
                        </CardContent>
                        {/* <CardFooter>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                        </CardFooter> */}

                        <CardFooter>
                        <SubmitButton text='Save' />
                    </CardFooter>
                    </form>
                </Card>
            </div>

        </div>
    );
}
