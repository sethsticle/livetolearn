"use client"
import { UploadDropzone } from "@/app/utils/UploadthingComponents";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { SubmitButton } from "../SubmitButtons";
import { toast } from "sonner";
import { UpdateSiteAction } from "@/app/actions";

interface UploadImageFormProps {
    siteId: string;
}

export function UploadImageForm({siteId}: UploadImageFormProps) {

    const [imageUrl, setImageUrl] = useState<undefined | string>(undefined)

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Upload Image
                </CardTitle>
                <CardDescription>
                    Upload an image to be used as the cover image for your post
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* cover image input */}
                {imageUrl ? (
                    <Image src={imageUrl} alt='UploadedImage' 
                    className='object-cover w-[200px] h-[200px] rounded-lg' width={200} height={200} />
                ):(
                    <UploadDropzone endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        setImageUrl(res[0].url);
                        toast.success("Hooray! Image has been uploaded");
                    }}  
                    onUploadError={() => {
                        toast.error("We are terribly sorry, but the image has failed to upload");
                    }}
                    />
                )}
            </CardContent>
            <CardFooter className="justify-center">
                <form action={UpdateSiteAction}>
                    <input type="hidden" name="siteId" value={siteId} /> {/* using this to store the current siteId that is being viewed */}
                    <input type="hidden" name="imageUrl" value={imageUrl} /> {/* using this to store the current image for updating the post */}
                <SubmitButton text='Save' className="bg-blue-500"/>
                </form>
            </CardFooter>
        </Card>
    )}