import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "./db";

export const requireUser = async () => {
  const { getUser } = getKindeServerSession(); // Get user info
  const user = await getUser(); // Fetch user info

  if (!user) {
    return redirect('/api/auth/login'); // Redirect to login if no user
  }

  return user;
};

export const requireAdmin = async () => {
  const user = await requireUser(); // Ensure user is authenticated

  const admin = await prisma.user.findUnique({
    where: {
      id: user.id,
      role: "ADMIN", // Check if user is admin
    },
  });

  if (!admin) {
    console.log("not admin");
    return redirect('/dashboard'); // Redirect if not admin
  }

  return true; // Allow access if admin
};

// //this is a custom useHook for protecting server actions
// //super useful...gotta thank Kinde for this

// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
// import { redirect } from "next/navigation"
// import prisma from "./db"

// const requireUser = async () => {
//     const { getUser } = getKindeServerSession() //get our user info

//     const user = await getUser() //fetch that info

//     //we now want to say that we only want to allow server actions for exisiting authenticated users
//     //if not-> we direct to the login screen (kinde's)
//     if(!user) {
//         return redirect('/api/auth/login')
//     }

//     // //we now want to search the database for the user's role
//     // //if the user is not an admin, we want to redirect them to the login page
//     // if(user.role !== 'ADMIN') {
//     //     return redirect('/api/auth/login')
//     // }

//     return user
// }

// export const requireAdmin = async () => {
//     const user = await requireUser()

//     //we now want to search the database for the user's role
//     //if the user is not an admin, we want to redirect them to the login page

//     const admin = await prisma.user.findUnique({
//         where: {
//             id: user.id,
//             role: "ADMIN",
//         },

//     })

//     if(!admin) {
//         console.log("not admin")
//         return redirect('/dashboard')
//     }

//     return true
// }