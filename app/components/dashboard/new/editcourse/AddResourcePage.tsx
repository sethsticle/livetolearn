"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AddResourceAction } from '@/app/actions';
import { useFormState } from 'react-dom';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { resourceSchema } from '@/app/utils/zodSchema';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitButton } from '@/app/components/dashboard/SubmitButtons';
import { BackButton } from '@/app/components/BackButton';
import { Concept } from '@/app/utils/types';

export default function AddResourcePage({ params, concepts }: { params: { courseId: string; slug: string }; concepts: Concept[] }) {
  const [lastResult, action] = useFormState(AddResourceAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: resourceSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="flex flex-col w-full h-full">
      <div><BackButton path={`/dashboard/courses/${params.courseId}/module/${params.slug}`} text="Cancel" /></div>
      <div className="flex flex-col flex-1 items-center justify-center">
        <Card className=" w-full">
          <CardHeader className="text-center">
            <CardTitle>Add New Resource</CardTitle>
          </CardHeader>
          <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <input type="hidden" name="moduleSlug" value={params.slug} />
            <input type="hidden" name="courseId" value={params.courseId} />
            <CardContent className="flex flex-col gap-2">
              <Input name={fields.name.name} placeholder="Resource Name" defaultValue="" />
              <p className="text-red-500 text-sm">{fields.name.errors}</p>

              <Input name={fields.link.name} placeholder="Resource Link" defaultValue="" />
              <p className="text-red-500 text-sm">{fields.link.errors}</p>

              <select name={fields.type.name} defaultValue="" className="p-2 border rounded">
                <option value="">Select Resource Type</option>
                <option value="TEXTBOOK">Textbook</option>
                <option value="TUTORIAL_LETTER">Tutorial Letter</option>
                <option value="ADDITIONAL_RESOURCE">Additional Resource</option>
                <option value="YOUTUBE_LINK">YouTube Link</option>
              </select>
              <p className="text-red-500 text-sm">{fields.type.errors}</p>

              <select name="conceptId" className="p-2 border rounded">
                <option value="">Select Concept</option>
                {concepts.length > 0 ? concepts.map(concept => (
                  <option key={concept.id} value={concept.id}>
                    {concept.name}
                  </option>
                )) : (
                  <option value="" disabled>No Concepts Available</option>
                )}
              </select>

              <Textarea name={fields.description.name} placeholder="Resource Description" defaultValue="" />
              <p className="text-red-500 text-sm">{fields.description.errors}</p>
            </CardContent>
            <CardFooter>
              <SubmitButton text="Save" />
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
