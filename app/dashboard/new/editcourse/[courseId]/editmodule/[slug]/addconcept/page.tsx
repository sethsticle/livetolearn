"use client"
import { AddConceptAction } from '@/app/actions';
import { BackButton } from '@/app/components/BackButton';
import { SubmitButton } from '@/app/components/dashboard/SubmitButtons';
import { conceptSchema } from '@/app/utils/zodSchema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";


export default function AddConceptRoute({ params }: { params: { courseId: string, slug: string } }) {

  const [lastResult, action] = useFormState(AddConceptAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: conceptSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  console.log("Module slug in AddConceptCard/page.tsx", params.slug)

  return (
    <>
      <header><BackButton path={`/dashboard/courses/${params.courseId}/module/${params.slug}`} text='Back to Module' /></header>
      <div className="flex flex-col flex-1 items-center justify-center">
        <Card className="max-w-[450px]">
          <CardHeader className="flex gap-2 text-center">
            <CardTitle>Add New Concept</CardTitle>
            <CardDescription>
              Add or remove concepts for the module here and click Save to confirm!
            </CardDescription>
          </CardHeader>
          <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <input type="hidden" name="slug" value={params.slug} />
            <input type="hidden" name="courseId" value={params.courseId} />

            <CardContent className="grid gap-6">
              <Input name={fields.name.name} key={fields.name.name} placeholder="Concept Name" />
              <p className="text-red-500 text-sm">{fields.name.errors}</p>

              <Textarea name={fields.description.name} key={fields.description.name} placeholder="Concept Description" />
              <p className="text-red-500 text-sm">{fields.description.errors}</p>
            </CardContent>
            <CardFooter className="justify-center">
              <SubmitButton text="Add" />
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );

}

