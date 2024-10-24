
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware'

export default withAuth({
    //what is the login page?
    //do i want to return to the page the user just requested?
    loginPage: '/api/auth/login',
    isReturnToCurrentPage: true, 
})

export const config = {
    matcher: ['/dashboard/:path*']
}

// import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
// import { NextRequest, NextResponse } from 'next/server';
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
// import prisma from '@/app/utils/db';
// import { requireAdmin } from './app/utils/requireAdmin';

// // Use withAuth to handle general authentication for all protected routes
// export default withAuth(async function middleware(req: NextRequest) {
//   const { getUser } = getKindeServerSession();
//   const user = await getUser();

//   // Handle the specific admin check for /dashboard/courses/newcourse
//   const url = req.nextUrl;

//   // Check if the current path is the admin-protected route
//   if (url.pathname.startsWith('/dashboard/new/newcourse')) {
//     // Fetch the user from the Prisma database
//     const dbUser = await requireAdmin()
//     // If the user is not an admin, redirect to the dashboard
//     if (!dbUser) {
//       return NextResponse.redirect(new URL('/dashboard', req.url));
//     }
//   }

//   // For all other routes, allow the request to continue
//   return NextResponse.next();
// }, {
//   loginPage: '/api/auth/login',
//   isReturnToCurrentPage: true, // Optional: return user to the current page after login
// });

// // Apply the middleware to all relevant routes
// export const config = {
//   matcher: ['/dashboard/:path*'], // Protect all dashboard routes
// };
