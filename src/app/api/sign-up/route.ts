import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";




export async function POST(request : Request) {
    await dbConnect()
    try {
      const {username, email, password} = await request.json() /* Collect data from request */

      /*  then Apply methods and play with data  */

      const existingUserVerifiedByUsername = await UserModel.findOne({      // checking username availaible or not 
        username,
        isVerified : true
      })

      if (existingUserVerifiedByUsername) {
        return Response.json(
            {
                success : false,
                message : 'Username is Already taken'
            },
            {
            status : 400
            }

        )
      }

     const existingUserByEmail =  await UserModel.findOne(  // checking email avialible or not
        {
            email
        }
    )

    const verifyCode = Math.floor(10000+Math.random()*900000).toString() // random verification code

    if (existingUserByEmail) {
        if (existingUserByEmail.isVerified) {
            return Response.json({
                success : false,
                message : 'User laready exist with this email'
            },{status : 400})
        }   
        else{
            const hasedPassword = await bcrypt.hash(password,10)
            existingUserByEmail.password = hasedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
            await existingUserByEmail.save()
        } 
    } 

    else{
      const hasedPassword = await bcrypt.hash(password,10) // bcrypt password

      const expiryDate = new Date() // expire date
      expiryDate.setHours(expiryDate.getHours() + 1 )

     const newUser = new UserModel(   /// save new data 
        {
            username ,
            email ,
            password : hasedPassword,
            verifyCode ,
            verifyCodeExpiry : expiryDate,
            isVerified : false,
            isAcceptingMessage : true,
            message : []
        }
    )
    await newUser.save()
    }

        // send Verifiaction Email

       const emailResponse =  await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success : false,
                message  : emailResponse.message
            },{status : 500})
        }

        return Response.json({
            success : true,
            message : 'User registerd succesfully user,please verify your email'
        },{status : 201 })




    } catch (error) {
        console.log('Error registering user',error);
        return Response.json(
            {
                success : false,
                message : "Error registering user"
            },
            {
                status : 500
            }
        )
    }
}