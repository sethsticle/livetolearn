"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";
import { ModuleType } from "@/app/utils/types";
import { useFormState } from "react-dom";
import { EditModuleAction } from "@/app/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { moduleSchema } from "@/app/utils/zodSchema";
import { Label } from "@/components/ui/label";
import TailwindEditor from "../../TailwindEditor";
import { useState } from "react";
import { JSONContent } from "novel";


export default function EditModuleForm({ moduleData, moduleSlug, courseId }: { moduleData: ModuleType, moduleSlug: string, courseId: string }) {

    const [value, setValue] = useState<JSONContent | undefined>(moduleData?.details)
    const [lastResult, action] = useFormState(EditModuleAction, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: moduleSchema });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });


    console.log("Module data in EditModuleForm/page.tsx", moduleData)
    console.log("Module slug being submitted:", moduleSlug);
    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <Card className="w-full h-full p-4 px-8">
                <CardHeader className="flex gap-2 text-center">
                    <CardTitle>Edit a Module</CardTitle>
                    <CardDescription>
                        Update the module details and click &apos;Save&apos; to confirm!
                    </CardDescription>
                </CardHeader>
                <form id={form.id} onSubmit={form.onSubmit} action={action}>
                    <input type="hidden" name="moduleSlug" value={moduleSlug} />
                    <input type="hidden" name="courseId" value={courseId} />
                    <input type="hidden" name="details" value={JSON.stringify(value)} />
                    <CardContent className="grid gap-6">
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Module Name</Label>
                                <Input name={fields.name.name} placeholder="Module Name" defaultValue={moduleData.name} />
                                <p className="text-red-500 text-sm">{fields.name.errors}</p>
                            </div>
                        </div>
                            <div className="grid gap-3">
                                <Label htmlFor="description">Module Description</Label>
                        <Textarea name={fields.description.name} placeholder="Module Description" defaultValue={moduleData.description} />
                        <p className="text-red-500 text-sm">{fields.description.errors}</p>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="slug">Module Slug</Label>
                        <Input name={fields.slug.name} placeholder="Module Slug" defaultValue={moduleData.slug} />
                        <p className="text-red-500 text-sm">{fields.slug.errors}</p>
                            </div>


                        <select name={fields.year.name} key={fields.year.name} className="mt-2 p-2 border rounded" defaultValue={moduleData.year}>
                            <option value="">Select Year</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>

                            <div className="grid gap-3">
                                <Label htmlFor="details" className="text-center">Module Details</Label>
                                <TailwindEditor onChange={setValue} initialValue={value} />
                                {/* <p className="text-red-500 text-sm">{fields.details.errors}</p> */}
                            </div>

                    </CardContent>
                    <CardFooter className="justify-center">
                        <SubmitButton text="Save" />
                    </CardFooter>
                </form>
            </Card>
        </div>
    );

}