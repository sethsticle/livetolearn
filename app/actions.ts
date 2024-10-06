"use server" //due to line 6 CRUCIAL
import { redirect } from "next/navigation";
import { parseWithZod } from '@conform-to/zod'
import { PostSchema, SiteCreationSchema } from "./utils/zodSchema";
import prisma from "./utils/db"; //CRUCIAL ERROR DONT FORGET
import { requireUser } from "./utils/requireUser";

export async function CreateSiteAction(_prevState: unknown, formData: FormData) {
    const user = await requireUser();

    const [subStatus, sites] = await Promise.all([
      prisma.subscription.findUnique({
        where: {
          userId: user.id,
        },
        select: {
          status: true,
        },
      }),
      prisma.site.findMany({
        where: {
          userId: user.id,
        },
      }),
    ]);

    if (!subStatus || subStatus.status !== "active") {
      if (sites.length < 2) {
        // Allow creating a site
        const submission = await parseWithZod(formData, {
          schema: SiteCreationSchema({
            async isSubdirectoryUnique() {
              const existingSubDirectory = await prisma.site.findUnique({
                where: {
                  subdirectory: formData.get("subdirectory") as string,
                },
              });
              return !existingSubDirectory;  // Return true if unique, false otherwise
            },
          }),
          async: true,
        });

        if (submission.status !== "success") {
          return submission.reply();
        }

         await prisma.site.create({
          data: {
            description: submission.value.description,
            name: submission.value.name,
            subdirectory: submission.value.subdirectory,
            userId: user.id,
          },
        });

        return redirect("/dashboard/sites");
      } else {
        // User already has one site, don't allow
        return redirect("/dashboard/pricing");
      }
    } else if (subStatus.status === "active") {
      // User has an active plan, allow site creation
      const submission = await parseWithZod(formData, {
        schema: SiteCreationSchema({
          async isSubdirectoryUnique() {
            const existingSubDirectory = await prisma.site.findUnique({
              where: {
                subdirectory: formData.get("subdirectory") as string,
              },
            });
            return !existingSubDirectory; // Return true if unique, false otherwise
          },
        }),
        async: true,
      });

      if (submission.status !== "success") {
        return submission.reply();
      }

       await prisma.site.create({
        data: {
          description: submission.value.description,
          name: submission.value.name,
          subdirectory: submission.value.subdirectory,
          userId: user.id,
        },
      });
      //console.log('Response:', response);
      return redirect("/dashboard/sites");
    }
}



// export async function CreateSiteAction(prevState: any, formData: FormData) {
//we wont use prevState, just needed for first rep...->should prob figure out how that actually works

//     //we will use the requireUser.ts file to secure our server actions
//     const user = await requireUser()
//     //^^This is securing the endpoint -> will redirect if no user

//     //lets now validate and typesafe data on the server

//     //here we are validating the data on the server side using zod and conform
//     //we now need to make sure the subdirectory is unique
//     //we will use the SiteCreationSchema to validate the subdirectory
//     const submission = await parseWithZod(formData, {
//         schema: SiteCreationSchema({
//             async isSubdirectoryUnique() {
//                 const existingSubDirectory = await prisma.site.findUnique({
//                     where: {
//                         subdirectory: formData.get('subdirectory') as string,
//                     },
//                 })
//                 return !existingSubDirectory //this simply says this is DEFIINTIELY defined
//             }
//         }),
//         async: true,
//     })

//     if (submission.status !== 'success') {
//         return submission.reply()
//     }


    

//     const response = await prisma.site.create({
//         data: {
//             description: submission.value.description,
//             name: submission.value.name,
//             subdirectory: submission.value.subdirectory,
//             //we now want to say that when we create a prisma site, we want a relation to the user
//             userId: user.id,
//             //^^Owner of the current site
//         }
//     })

//     return redirect('/dashboard/sites')
// }

//done forget to secure our server function...use the 


export async function CreatePostAction(_prevState: unknown, formData: FormData) {
    const user = await requireUser()

    //^^This is securing the endpoint -> will redirect if no user

    //lets now validate and typesafe data on the server
    //we will use zod and conform

    //here we are validating the data on the server side
    const submission = parseWithZod(formData, {
        schema: PostSchema,
    })

    if (submission.status !== 'success') {
        return submission.reply()
    }

    const siteId = formData.get('siteId') as string | null;
    //console.log('siteId received in action.ts:', siteId);
    if (!siteId) {
        throw new Error("Missing siteId");
    }

     await prisma.post.create({
        data: {
            title: submission.value.title,
            smallDescription: submission.value.smallDescription,
            slug: submission.value.slug,
            postContent: JSON.parse(submission.value.postContent),
            image: submission.value.coverImage,
            userId: user.id,
            siteId, // Now using the validated siteId
        }
    })

    return redirect(`/dashboard/sites/${formData.get('siteId')}`)
}

export async function EditPostAction(_prevState: unknown, formData: FormData) {
    const user = await requireUser()

    //^^This is securing the public endpoint -> will redirect if no user

    //lets now validate and typesafe data on the server
    //we will use zod and conform

    //here we are validating the data on the server side
    const submission = parseWithZod(formData, {
        schema: PostSchema,
    })

    if (submission.status !== 'success') {
        return submission.reply()
    }
    
     await prisma.post.update({
        where: {
            userId: user.id,
            id: formData.get('postId') as string ,
        },
        data: {
            title: submission.value.title,
            slug: submission.value.slug,
            postContent: JSON.parse(submission.value.postContent),  //string->Json object...same as CreatePostAction
            image: submission.value.coverImage,
            smallDescription: submission.value.smallDescription,
        }
        
    })

    //console.log('Data:', data); // Log the data being fetched

    return redirect(`/dashboard/sites/${formData.get('siteId')}`)
}

export async function DeletePostAction(formData: FormData) {
    const user = await requireUser()

    //^^This is securing the public endpoint -> will redirect if no user

     await prisma.post.delete({
        where: {
            userId: user.id,
            id: formData.get('postId') as string ,
        },
        
    })

    //console.log('Data:', data); // Log the data being fetched

    return redirect(`/dashboard/sites/${formData.get('siteId')}`)
}

export async function UpdateSiteAction(formData: FormData) {
    const user = await requireUser()

    //^^This is securing the endpoint -> will redirect if no user

    //lets now validate and typesafe data on the server

    //here we are validating the data on the server side using zod and conform
     await prisma.site.update({
        where: {
            userId: user.id,
            id: formData.get('siteId') as string ,
        },
        data: {
            imageUrl: formData.get('imageUrl') as string,
        }
    })
    
    return redirect(`/dashboard/sites`)
}

export async function DeleteSiteAction(formData: FormData) {
    const user = await requireUser()
    //^^This is securing the endpoint -> will redirect if no user

     await prisma.site.delete({
        where: {
            userId: user.id,
            id: formData.get('siteId') as string ,
        },
        
    })

    return redirect(`/dashboard/sites`)
 }


 //this is a function that will create a subscription for the user
 //currently set up for stripe api...will need to change to Yoco
// export async function CreateSubscription() {
//     const user = await requireUser();
  
//     let stripeUserId = await prisma.user.findUnique({
//       where: {
//         id: user.id,
//       },
//       select: {
//         customerId: true,
//         email: true,
//         firstName: true,
//       },
//     });
  
//     if (!stripeUserId?.customerId) {
//       const stripeCustomer = await stripe.customers.create({
//         email: stripeUserId?.email,
//         name: stripeUserId?.firstName,
//       });
  
//       stripeUserId = await prisma.user.update({
//         where: {
//           id: user.id,
//         },
//         data: {
//           customerId: stripeCustomer.id,
//         },
//       });
//     }
  
//     const session = await stripe.checkout.sessions.create({
//       customer: stripeUserId.customerId as string,
//       mode: "subscription",
//       billing_address_collection: "auto",
//       payment_method_types: ["card"],
//       line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
//       customer_update: {
//         address: "auto",
//         name: "auto",
//       },
//       success_url:
//         process.env.NODE_ENV === "production"
//           ? "https://blog-marshal.vercel.app/dashboard/payment/success"
//           : "http://localhost:3000/dashboard/payment/success",
//       cancel_url:
//         process.env.NODE_ENV === "production"
//           ? "https://blog-marshal.vercel.app/dashboard/payment/cancelled"
//           : "http://localhost:3000/dashboard/payment/cancelled",
//     });
  
//     return redirect(session.url as string);
//   }