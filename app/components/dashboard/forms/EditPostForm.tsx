"use client"

import { UploadDropzone } from "@/app/utils/UploadthingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Atom } from "lucide-react";
import Image from "next/image";
import TailwindEditor from "../EditorWrapper";
import { SubmitButton } from "../SubmitButtons";
import { useState } from "react";
import { JSONContent } from "novel";
import { useFormState } from "react-dom";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { PostSchema } from "@/app/utils/zodSchema";
import { toast } from "sonner";
import slugify from "react-slugify";
import { EditPostAction } from "@/app/actions";



//remember that we fetch the default values to input into the fields to differentiate between the edit and create routes
//get this data from the params in postId server component
interface EditPostFormProps {
    data: {
        id: string;
        title: string;
        slug: string;
        smallDescription: string;
        postContent: any; //hehehe its actually JSONContent...naughty naughty
        image: string;
    }
    siteId: string;
}

export function EditPostForm({data, siteId}: EditPostFormProps) {

    const [imageUrl, setImageUrl] = useState<undefined | string>(data.image)
    const [value, setValue] = useState<JSONContent | undefined>(data.postContent)
    const [title, setTitle] = useState<string | undefined>(data.title)
    const [slug, setSlugValue] = useState<string | undefined>(data.slug)


    const [lastResult, action] = useFormState(EditPostAction, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: PostSchema })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    function handleSlugGeneration() {
        //const titleInput = title.replaceAll(" ", "-").toLowerCase()
        const titleInput = title

        if (titleInput?.length === 0 || titleInput === undefined) {
            return toast.error("Please enter a title for your article first")
        }

        setSlugValue(slugify(titleInput))

        return toast.success("Slug has been generated")
    }

    return (
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>
                    Article Details
                </CardTitle>
                <CardDescription>Let your viewers know what to expect!</CardDescription>
            </CardHeader>
            <CardContent>
                <form className='flex flex-col gap-6 ' id={form.id} onSubmit={form.onSubmit} action={action}>

                    <input type='hidden' name='postId' value={data.id} /> {/* using this to store the current data point for editing the post */}
                    <input type='hidden' name='siteId' value={siteId} /> {/* using this to store the current siteId that is being viewed */}
                    {/* title input */}
                    <div className='grid gap-2'>
                        <Label>Title</Label>
                        <Input key={fields.title.key}
                            name={fields.title.name}
                            defaultValue={fields.title.initialValue}
                            placeholder='Nextjs is the new biggest thing!'
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                        <p className='text-red-500'>{fields.title.errors}</p>
                    </div>

                    {/* slug input */}
                    <div className='grid gap-2'>
                        <Label>Slug</Label>
                        <Input
                            key={fields.slug.key}
                            name={fields.slug.name}
                            defaultValue={fields.slug.initialValue}
                            placeholder='article-slug'
                            onChange={(e) => setSlugValue(e.target.value)}
                            value={slug}
                        />

                        <Button className='w-fit' variant={'secondary'} type='button' onClick={handleSlugGeneration}>
                            <Atom className='size-4 mr-2' />
                            Generate Slug
                        </Button>
                        <p className='text-red-500'>{fields.slug.errors}</p>
                    </div>

                    {/* description input */}
                    <div className='grid gap-2'>
                        <Label>Small Description</Label>
                        <Textarea
                            key={fields.smallDescription.key}
                            name={fields.smallDescription.name}
                            // defaultValue={fields.smallDescription.initialValue}
                            defaultValue={data.smallDescription}
                            placeholder='Small description telling us some more juicy stuff!'></Textarea>
                        <p className='text-red-500 text-sm'>{fields.smallDescription.errors}</p>
                    </div>

                    {/* cover image input */}
                    <div className='grid gap-2'>
                        <Label>Cover Image</Label>
                        <input type="hidden"
                            name={fields.coverImage.name}
                            key={fields.coverImage.key}
                            defaultValue={fields.coverImage.initialValue}
                            value={imageUrl}
                        />
                        {imageUrl ?
                            (
                                <Image src={imageUrl} alt='UploadedImage' className='object-cover w-[200px] h-[200px] rounded-lg' width={200} height={200} />
                            ) : (
                                <UploadDropzone
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        setImageUrl(res[0].url);
                                        toast.success("Hooray! Image has been uploaded");
                                    }}
                                    onUploadError={() => {
                                        toast.error("We are terribly sorry, but the image has failed to upload");
                                    }}
                                />
                            )}

                        <p className='text-red-500 text-sm'>{fields.coverImage.errors}</p>
                    </div>


                    {/* article content input */}
                    <div className='grid gap-2'>
                        <Label>Article Content</Label>
                        <input type='hidden'
                            name={fields.postContent.name}
                            key={fields.postContent.key}
                            defaultValue={fields.postContent.initialValue}
                            value={JSON.stringify(value)}
                        />
                        <TailwindEditor onChange={setValue} initialValue={value} />
                        <p className='text-red-500 text-sm'>{fields.postContent.errors}</p>
                    </div>

                    <SubmitButton text='Save' />
                </form>
            </CardContent>
        </Card>
    )
}