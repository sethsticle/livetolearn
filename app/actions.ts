"use server" //due to line 6 CRUCIAL
import { redirect } from "next/navigation";
import { parseWithZod } from '@conform-to/zod'
import { conceptSchema, CourseCreationSchema, CourseEditSchema, ModuleCreationSchema, moduleSchema, PostSchema, resourceSchema, SiteCreationSchema } from "./utils/zodSchema";
import prisma from "./utils/db"; //CRUCIAL ERROR DONT FORGET
import { requireUser } from "./utils/requireUser";
import { requireAdmin } from "./utils/requireAdmin";
import { Question, Quiz } from "./utils/types";

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

export async function CreateCourseAction(_prevState: unknown, formData: FormData) {
   await requireAdmin();

  
      // Allow creating a site
      const submission = await parseWithZod(formData, {
        schema: CourseCreationSchema({
          async isSubdirectoryUnique() {
            const existingSubDirectory = await prisma.course.findUnique({
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

       await prisma.course.create({
        data: {
          description: submission.value.description,
          name: submission.value.name,
          subdirectory: submission.value.subdirectory,
          degreeCode: submission.value.degreeCode,
        },
      });

      
    //console.log('Response:', response);
    return redirect("/dashboard");
  
}

export async function EditCourseAction(_prevState: unknown, formData: FormData) {
  // Validate the course form
  const submission = await parseWithZod(formData, {
    schema: CourseEditSchema(),
    async: true,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  // Update the course data
  const course = await prisma.course.update({
    where: { id: formData.get('courseId') as string },
    data: {
      name: submission.value.name,
      description: submission.value.description,
      subdirectory: submission.value.subdirectory,
      degreeCode: submission.value.degreeCode,
      details: JSON.parse(submission.value.details),
    },
  });
  
  return redirect(`/dashboard/courses/${course.id}`);
}

export async function EditModuleAction(_prevState: unknown, formData: FormData) {
  // Validate the module form
 const submission = await parseWithZod(formData, {
  schema: moduleSchema(),
  async: true,
});

if (submission.status !== 'success') {
  return submission.reply();
}
const courseId = formData.get("courseId") as string;

if (!formData.get('moduleSlug')) {
  throw new Error("Module ID is missing or invalid.");
}

 await prisma.module.update({
  where: {
    slug: formData.get('moduleSlug') as string ,
  },
  data: {
    name: submission.value.name,
    description: submission.value.description,
    slug: submission.value.slug,
    year: submission.value.year,
    details: JSON.parse(formData.get('details') as string),
  },
});


//console.log('Data:', data); // Log the data being fetched

return redirect(`/dashboard/courses/${courseId}/module/${formData.get('moduleSlug')}`);
}
export async function AddModuleAction(_prevState: unknown, formData: FormData) {
  // Validate the module form
  const submission = await parseWithZod(formData, {
    schema: ModuleCreationSchema({
      async isSubdirectoryUnique() {
        const existingSubDirectory = await prisma.module.findUnique({
          where: {
            slug: formData.get("slug") as string,
          },
        });
        return !existingSubDirectory;  // Return true if unique, false otherwise
      },
    }),
    async: true,
  });

  const courseId = formData.get("courseId") as string;
  if (!courseId) {
    throw new Error("Course ID is missing.");
  }

  if (submission.status !== "success") {
    return submission.reply();
  }

  // Create the module
  const foundModule = await prisma.module.create({
    data: {
      name: submission.value.name,
      description: submission.value.description,
      courseId: courseId,
      slug: submission.value.slug,
      year: submission.value.year
    },
  });


  // Create a default quiz for the module

  const quiz = await prisma.quiz.create({
    data: {
      title: `Quiz for ${foundModule.name}`,
      description: `Default quiz for module ${foundModule.name}`,
      moduleSlug: foundModule.slug,
    },
  });

  console.log("Quiz created with ID:", quiz.id); // Confirm Quiz creation

  return redirect(`/dashboard/new/editcourse/${courseId}/`);
}


//edit module action

export async function DeleteModuleAction({ moduleId }: { moduleId: string }) {
  await prisma.module.delete({
    where: {
      id: moduleId,
    },
  });
  // Return success or redirect
  return { status: 'success' };
}


export async function AddResourceAction(_prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: resourceSchema });

  if (submission.status !== 'success') {
    return submission.reply(); // Return validation errors
  }

  const { moduleSlug, courseId, conceptId } = Object.fromEntries(formData);

  const user = await requireUser();

  const moduleExists = await prisma.module.findUnique({
    where: { slug: moduleSlug as string },
    select: { id: true },
  });

  if (!moduleExists) {
    throw new Error("Module with the given slug does not exist.");
  }

  const existingResource = await prisma.resource.findUnique({
    where: { slug: submission.value.link },
  });

  if (existingResource) {
    return submission.reply(); // Resource exists, stop process
  }

  await prisma.resource.create({
    data: {
      name: submission.value.name,
      slug: submission.value.link,
      description: submission.value.description || '',
      type: submission.value.type,
      moduleId: moduleExists.id,
      userId: user.id,
      conceptId: conceptId ? String(conceptId) : null,
    },
  });

  return redirect(`/dashboard/courses/${courseId}/module/${moduleSlug}`);
}



export async function AddConceptAction(_prevState: unknown, formData: FormData) {
  const submission = await parseWithZod(formData, {
    schema: conceptSchema, 
    async: true
  })

  if (submission.status !== 'success') {
    return submission.reply()
}

const moduleSlug = formData.get('slug') as string;
const courseId = formData.get('courseId') as string;
console.log("ModuleSlug from @Action: ", moduleSlug);

if (!moduleSlug) {
    throw new Error("Missing moduleSlug from addConceptAction");
}


const moduleExists = await prisma.module.findUnique({
  where: { slug: moduleSlug },
  select: { id: true, slug: true }, // Fetch only the id
});

if (!moduleExists) {
  throw new Error("Module with the given slug does not exist.");
}

  await prisma.concept.create({
    data: {
      name: submission.value.name,
      description: submission.value.description,
      moduleId: moduleExists.id, // Use the module's id here
    },
  })
  
  return redirect(`/dashboard/courses/${courseId}/module/${moduleExists.slug}`)
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

 interface FetchConceptsInput {
  moduleSlug: string;
}

export async function fetchConcepts({ moduleSlug }: FetchConceptsInput) {
  // Fetch the module by slug
  const foundModule = await prisma.module.findUnique({
    where: { slug: moduleSlug },
    select: { id: true },
  });

  if (!foundModule) {
    throw new Error("Module not found");
  }

  // Fetch concepts related to the module
  const concepts = await prisma.concept.findMany({
    where: { moduleId: foundModule.id },
    include: { resources: true },
  });

  return concepts;
}

export async function fetchQuizData(slug: string): Promise<Quiz | null> {
  const quiz = await prisma.quiz.findFirst({
    where: {moduleSlug: slug },
    include: { question: true },
  });

  if (!quiz) return null;

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description || "",
    questions: quiz.question.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
    })),
  };
}
export async function createQuestion(moduleSlug: string, questionData: Omit<Question, 'id'>) {
  // Find the quiz associated with the moduleSlug
  const quiz = await prisma.quiz.findUnique({
    where: { moduleSlug },
  });

  if (!quiz) {
    throw new Error(`Quiz for module with slug ${moduleSlug} does not exist.`);
  }

  // Now use the found quiz.id to create the question
  return prisma.question.create({
    data: {
      quizId: quiz.id,
      questionText: questionData.questionText,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
    },
  });
}

export async function fetchQuestionsForQuiz(slug: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { moduleSlug: slug },
    include: { question: true },
  });

  return quiz?.question || [];
}

export async function deleteQuestion(questionId: string) {
  return prisma.question.delete({
    where: {
      id: questionId,
    },
  });
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