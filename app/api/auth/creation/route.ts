import prisma from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

// Handle the GET request for user creation
export async function GET() {
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser(); // Fetch the user session
        console.log("user in GET: ", user)

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
        if(!dbUser){
        try {
            dbUser = await prisma.user.create({
                data: {
                    id: user.id,
                    firstName: user.given_name ?? "",
                    lastName: user.family_name ?? "",
                    email: user.email ?? "",
                    profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
                    role: "ADMIN",  // Ensure this is set to an allowed enum value
                },
            });
        } catch (error) {
            console.error("Error creating user:", error);  // Log the error for debugging
            return NextResponse.json({ message: "Error creating user." }, { status: 500 });
        }
    
    }
        // Redirect to dashboard after successful operation
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);
    } catch (error: unknown) {  // Use unknown 
        // Check if the error has a message property and handle it
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message || "Something went wrong." }, { status: 500 });
        }
        // Fallback if it's not an instance of Error
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
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