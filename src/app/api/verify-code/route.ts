import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/model/User";

export async function POST(request : Request)  {
    await dbConnect()

    try {
     
        const {username,code} = await request.json() // access from request means from fronted  access username and code
        
        const decodedusername  =  decodeURIComponent(username) // then decoded

        const user =  await UserModel.findOne({username : decodedusername}) // then query to datbase find these thiongs usrname and code

      if (!user) {                // if username availible hen ook other waise send response to frooted
        return Response.json(
            {
                success: false,
                message : "User not not found"
            },
            {
                status : 400
            })
      }

    const isCodeValid = user.verifyCode === code  // now validate the code 
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date() // date set on the basis database 

    if (isCodeValid && isCodeNotExpired) {    // if these iscode and is notcode avalible then do user verified and save in the database 
        user.isVerified = true
        await user.save()
        
        return Response.json(    // then send response to fronted uour are verified
            {
                success: false,
                message : "Account Verified Successfully"
            },
            {
                status : 200
            })
    }else if (isCodeNotExpired) {   // id code is expired then send response to fronted again sign-up uour code is expired
        return Response.json(
            {
                success: false,
                message : "Verifivation code is expired please Signup again to get a new code"
            },
            {
                status : 400
            })

    }else {
        return Response.json({success : false , message : 'incorrect Verification code'},{ // if these are all not correct then send respone verification code is not correct
            status : 400
        })
    }


    } catch (error) {  // solve this error in try catch if first part not exexute means in try isseus then execute catch part  
        console.log('Error verifying User',error);
        return Response.json(
            {
                success : false,
                message : 'Error verifiyng User'
            },{
                status : 500
            })
        
    }
}