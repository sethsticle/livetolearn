"use client"
import { requireAdmin } from '@/app/utils/requireAdmin'
import React, { useEffect, useState } from 'react'
import { CreateCourseAction, CreateSiteAction } from '@/app/actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFormState } from 'react-dom'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { courseSchema, siteSchema } from '@/app/utils/zodSchema'
import { SubmitButton } from '@/app/components/dashboard/SubmitButtons'

function NewCourseForm() {
    // Handle the form state using useForm hooks
    const [lastResult, action] = useFormState(CreateCourseAction, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: courseSchema
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput"
    });

    return (
        <div className='flex flex-col flex-1 items-center justify-center'>
            <Card className='max-w-[450px]'>
                <CardHeader className=' flex gap-2 text-center'>
                    <CardTitle>
                        Create a Course
                    </CardTitle>
                    <CardDescription>
                        Upload the course details here and click &apos;Create&apos; to confirm!
                    </CardDescription>
                </CardHeader>

                {/* //form id comes from the useForm hook, first arg - form
    //passing onsubmit prop and action to the usehook as well */}
                <form id={form.id} onSubmit={form.onSubmit} action={action}>

                    <CardContent>
                        <div className='flex flex-col gap-y-6'>
                            <div className='grid gap-3'>
                                <Label>Course Name</Label>
                                <Input
                                    name={fields.name.name}
                                    key={fields.name.name}
                                    defaultValue={fields.name.initialValue} placeholder='Site name' />
                                <p className='text-red-500 text-sm'>{fields.name.errors}</p>
                            </div>
                            <div className='grid gap-3'>
                                <Label>Subdirectory</Label>
                                <Input name={fields.subdirectory.name}
                                    key={fields.subdirectory.key}
                                    defaultValue={fields.subdirectory.initialValue}
                                    placeholder='Subdirectory' />
                                <p className='text-red-500 text-sm'>{fields.subdirectory.errors}</p>
                            </div>
                            <div className='grid gap-3'>
                                <Label>Course Code</Label>
                                <Input
                                    name={fields.degreeCode.name}
                                    key={fields.degreeCode.name}
                                    defaultValue={fields.degreeCode.initialValue} placeholder='Site name' />
                                <p className='text-red-500 text-sm'>{fields.degreeCode.errors}</p>
                            </div>
                            <div className='grid gap-3'>
                                <Label>Description</Label>
                                <Textarea
                                    name={fields.description.name}
                                    key={fields.description.name}
                                    defaultValue={fields.description.initialValue}
                                    placeholder='Add a small description here...' />
                                <p className='text-red-500 text-sm'>{fields.description.errors}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className='justify-center'>
                        <SubmitButton text='Submit' />
                    </CardFooter>

                </form>

            </Card>
        </div>
    )
}

export default NewCourseForm