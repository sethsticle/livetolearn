import prisma from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

// Handle the GET request for user creation
export async function GET() {
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser(); // Fetch the user session

        // Ensure user exists, otherwise throw an error
        if (!user || !user.id) {
            return NextResponse.json({ message: "No user found, something went wrong." }, { status: 404 });
        }

        // Check if user already exists in the database
        let dbUser = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
        });

        // If user doesn't exist in DB, create a new one
        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    id: user.id,
                    firstName: user.given_name ?? "",
                    lastName: user.family_name ?? "",
                    email: user.email ?? "",
                    profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
                },
            });
        }

        // Redirect to dashboard after successful operation
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);
    } catch (error: any) {
        // Handle any errors during the request
        return NextResponse.json({ message: error.message || "Something went wrong." }, { status: 500 });
    }
}


// import prisma from "@/app/utils/db";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { NextResponse } from "next/server";

// //we want to get the data, store it in db if it is not or simply continue
// export async function GET() {
//     const { getUser } = getKindeServerSession()
//     const user = await getUser() //fetch the user

//     //check if user exists ->if it doesnt throw error
//     if(!user || user===null || !user.id)
//     {
//         throw new Error("No user found, something went wrong :(")
//     }

//     let dbUser = await prisma.user.findUnique({
//         where: {
//             id: user.id,
//         },
//     })

//     if(!dbUser)
//     {
//         dbUser = await prisma.user.create ({
//             data: {
//                 id: user.id,
//                 firstName: user.given_name ?? "",
//                 lastName: user.family_name ?? "",
//                 email: user.email ?? "",
//                 profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
//             }
//         })
//     }

//     return NextResponse.redirect("https://planetseth.xyz/dashboard")
// }