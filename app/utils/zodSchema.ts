import { conformZodMessage } from '@conform-to/zod'
import { z } from 'zod'

//our first schema to be used in the actions.ts file
export const siteSchema = z.object({
  //all the fields our sites will have 
  name: z.string().min(1, 'Name is required').max(35, 'Name must be less than 35 characters'),
  description: z.string().min(1, 'Description is required').max(100, 'Description must be less than 100 characters'),
  subdirectory: z.string().min(1, 'subdirectory is required').max(40, 'subdirectory must be less than 40 characters')
})

export const PostSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(1).max(190),
  coverImage: z.string().min(1),
  smallDescription: z.string().min(1).max(200),
  postContent: z.string().min(1)
  //^^ we will use this to validate the content of the post
})

export const courseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(35, 'Name must be less than 35 characters'),
  description: z.string().min(1, 'Description is required').max(100, 'Description must be less than 100 characters'),
  subdirectory: z.string().min(1, 'subdirectory is required').max(40, 'subdirectory must be less than 40 characters'),
  degreeCode: z.string().min(1, 'degreeCode is required').max(10, 'degreeCode must be less than 10 characters'),
  details: z.string().min(1, 'details are required')
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


export function CourseCreationSchema(options?: {
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
    degreeCode: z.string().min(1).max(10)
  });
}

export function moduleSchema() {
  return z.object({
    name: z.string().min(1, "Module name is required."),
    year: z.number().min(1).max(4, "Year must be between 1 and 4"),
    description: z.string().min(1, "Module description is required."),
    slug: z
      .string()
      .min(1)
      .max(40)
      .regex(/^[a-z0-9]+$/, "Slug must only use lowercase letters and numbers.")
      .transform((value) => value.toLocaleLowerCase()),
  });
}

// export function moduleEditSchema() {
//   return z.object({
//     name: z.string().min(1, "Module name is required."),
//     year: z.number().min(1).max(4, "Year must be between 1 and 4"),
//     description: z.string().min(1, "Module description is required."),
//     details: z.string().min(1, "Module details are required."),
//     slug: z
//       .string()
//       .min(1)
//       .max(40)
//       .regex(/^[a-z0-9]+$/, "Slug must only use lowercase letters and numbers.")
//       .transform((value) => value.toLocaleLowerCase()),
//   });
// }

export function ModuleCreationSchema(options?: {
  isSubdirectoryUnique: () => Promise<boolean>;
}) {
  return z.object({
    slug: z
      .string()
      .min(1)
      .max(40)
      .regex(/^[a-z0-9]+$/, "Slug must only use lowercase letters and numbers.")
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
    name: z.string().min(1).max(35, "Module name is required."),
    description: z.string().min(1).max(150, "Module description is required."),
    year: z.number().min(1).max(4, "Year must be between 1 and 4"),

  });

}

export function CourseEditSchema() {
  return z.object({
    name: z.string().min(1).max(35),
    description: z.string().min(1).max(150),
    degreeCode: z.string().min(1).max(10),
    details: z.string().min(1),
    subdirectory: z
      .string()
      .min(1)
      .max(40)
      .regex(/^[a-z0-9]+$/, "Subdirectory must only use lowercase letters and numbers."),
  });
}


  export function resourceSchema() {
    return z.object({
      name: z.string().min(1, "Resource name is required."),
      link: z.string().min(1, "Resource link is required."),
        // .url("Invalid URL format.")
        // .refine(link => {
        //   const googleDriveFilePattern = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?usp=sharing/;
        //   const googleDriveFolderPattern = /https:\/\/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/;
        //   const youtubePattern = /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
          
        //   return googleDriveFilePattern.test(link) || googleDriveFolderPattern.test(link) || youtubePattern.test(link);
        // }, "Must be a valid Google Drive (File or Folder) or YouTube link."),
      type: z.enum(["TEXTBOOK", "TUTORIAL_LETTER", "ADDITIONAL_RESOURCE", "YOUTUBE_LINK"]),
      description: z.string().optional()
    });
  }



export function conceptSchema() {
  return z.object({
    name: z.string().min(1, "Concept name is required."),
    description: z.string().optional(),
  });
}
