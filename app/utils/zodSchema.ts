import { conformZodMessage } from '@conform-to/zod'
import {z} from 'zod'

//our first schema to be used in the actions.ts file
export const siteSchema = z.object({
    //all the fields our sites will have 
    name: z.string().min(1, 'Name is required').max(35, 'Name must be less than 35 characters'),
    description: z.string().min(1, 'Description is required').max(100, 'Description must be less than 100 characters'),
    subdirectory: z.string().min(1, 'subdirectory is required').max(40, 'subdirectory must be less than 40 characters') 
})  

export const PostSchema = z.object({
    title: z.string().min(1).max(100),
    slug:  z.string().min(1).max(190),
    coverImage: z.string().min(1),
    smallDescription: z.string().min(1).max(200),
    postContent: z.string().min(1)
    //^^ we will use this to store the content of the post
})

//we will use this to make sure that the subdirectory is unique
//we will need async as we have to fetch the data from the database and use that to know if it unique or not
//we need the promise as we are saying the promise will either be unique or not
export function SiteCreationSchema(options?: {
    isSubdirectoryUnique: () => Promise<boolean>;
  }) {
    return z.object({
      subdirectory: z
        .string()
        .min(1)
        .max(40)
        .regex(/^[a-z]+$/, "Subdirectory must only use lowercase letters.")
        .transform((value) => value.toLocaleLowerCase())
        .pipe(
          z.string().superRefine((email, ctx) => {
            if (typeof options?.isSubdirectoryUnique !== "function") {
              ctx.addIssue({
                code: "custom",
                message: conformZodMessage.VALIDATION_UNDEFINED,
                fatal: true,
              });
              return;
            }
  
            return options.isSubdirectoryUnique().then((isUnique) => {
              if (!isUnique) {
                ctx.addIssue({
                  code: "custom",
                  message: "Subdirectory is already taken...",
                });
              }
            });
          })
        ),
      name: z.string().min(1).max(35),
      description: z.string().min(1).max(150),
    });
  }