"use client"
import { CreatePostAction } from '@/app/actions'
import { UploadDropzone } from '@/app/utils/UploadthingComponents'
import { PostSchema } from '@/app/utils/zodSchema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { ArrowLeft, Atom } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { JSONContent } from 'novel'
import React, { useState } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'
import slugify from 'react-slugify'
import { SubmitButton } from '@/app/components/dashboard/SubmitButtons'
import dynamic from 'next/dynamic'
import LoadingScreen from '@/app/components/LoadingScreen'

// Dynamically import the TailwindEditor component
const TailwindEditor = dynamic(() => import('@/app/components/dashboard/TailwindEditor'), {
    ssr: false,  // Disable server-side rendering for this component
    loading: () => <LoadingScreen/> // Optional: loading state
  });

function PostCreationRoute({ params }: { params: { siteId: string } }) {

    const [imageUrl, setImageUrl] = useState<undefined | string>(undefined)
    const [value, setValue] = useState<JSONContent | undefined>(undefined)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [slug, setSlugValue] = useState<string | undefined>(undefined)

    //we now need to use the get user hook we just made as well as the useAction
    //we will use the useAction hook to secure our server actions
    const [lastResult, action] = useFormState(CreatePostAction, undefined);
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
        <>
            {/* return button */}
            <div className='flex items-center gap-2'>
                <Button asChild><Link href={`/dashboard/sites/${params.siteId}`}><ArrowLeft className='size-4' /></Link></Button>
                <h1 className='text-xl font-semibold'>Create Article</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Article Details
                    </CardTitle>
                    <CardDescription>Let your viewers know what to expect!</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className='flex flex-col gap-6 ' id={form.id} onSubmit={form.onSubmit} action={action}>
                        
                        <input type='hidden' name='siteId' value={params.siteId} /> {/* using this to store the current siteId that is being viewed */}
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
                                defaultValue={fields.smallDescription.initialValue}
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

                       <SubmitButton text='Submit' />
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default PostCreationRoute