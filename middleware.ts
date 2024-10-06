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