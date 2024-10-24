"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/app/components/dashboard/SubmitButtons';
import { Course } from '@/app/utils/types';  // Import your types
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormState } from 'react-dom';
import { EditCourseAction } from '@/app/actions';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { courseSchema } from '@/app/utils/zodSchema';




export default function EditCourseForm({ courseData, courseId }: { courseData: Course, courseId: string }) {
    // Unique state for EditCourseForm
    const [lastResultEdit, actionEdit] = useFormState(EditCourseAction, undefined);  
  
    const [formEdit, fieldsEdit] = useForm({
      lastResult: lastResultEdit,
      onValidate({ formData }) {
        return parseWithZod(formData, { schema: courseSchema });
      },
      shouldValidate: "onBlur",
      shouldRevalidate: "onInput",
    });
  

    return (
      <div className="flex flex-col h-full w-full items-center justify-center">
        <Card className="w-full">
          <CardHeader className="flex gap-2 text-center">
            <CardTitle>Edit a Course</CardTitle>
            <CardDescription>Update the course details and click &apos;Save&apos; to confirm!</CardDescription>
          </CardHeader>
  
          <form id={formEdit.id} onSubmit={formEdit.onSubmit} action={actionEdit}>
            <input type="hidden" name="courseId" value={courseId} />
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Course Name</Label>
                  <Input name="name" defaultValue={courseData?.name || ''} />
                  <p className="text-red-500 text-sm">{fieldsEdit.name?.errors}</p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="subdirectory">Subdirectory</Label>
                  <Input name="subdirectory" defaultValue={courseData?.subdirectory || ''} />
                  <p className="text-red-500 text-sm">{fieldsEdit.subdirectory?.errors}</p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="degreeCode">Course Code</Label>
                  <Input name="degreeCode" defaultValue={courseData?.degreeCode || ''} />
                  <p className="text-red-500 text-sm">{fieldsEdit.degreeCode?.errors}</p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea name="description" defaultValue={courseData?.description || ''} />
                  <p className="text-red-500 text-sm">{fieldsEdit.description?.errors}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
            <SubmitButton text='Save Changes' />
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }
  