//this is a custom useHook for protecting server actions
//super useful...gotta thank Kinde for this

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

export  const requireUser = async () => {
    const { getUser } = getKindeServerSession() //get our user info

    const user = await getUser() //fetch that info

    //we now want to say that we only want to allow server actions for exisiting authenticated users
    //if not-> we direct to the login screen (kinde's)
    if(!user) {
        return redirect('/api/auth/login')
    }

    return user
}