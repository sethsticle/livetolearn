

//only Admins should be able to see this page
//prisma cnannot function on edge functions so will need to get creative
//will this as server side auth check, and display component or redirect depending

import NewCourseForm from "@/app/components/dashboard/new/newcourse/NewCourseForm"
import { requireAdmin } from "@/app/utils/requireAdmin"


async function CourseCreationRoute() {

    await requireAdmin()
    

    return (
       <NewCourseForm />
    )
}

export default CourseCreationRoute




