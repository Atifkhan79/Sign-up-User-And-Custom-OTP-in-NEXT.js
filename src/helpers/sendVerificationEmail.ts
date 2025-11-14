import { resend  } from '@/src/lib/resend'

import VerificationEmail from '@/email/VerificationEmail'
import { ApiResponse } from '../types/ApiResponse'


export async function sendVerificationEmail(
    email : string,
    username : string,
    VerifyCode : string,

): Promise<ApiResponse> {
    try {
        await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'zod message || Verification Code',
        react: VerificationEmail({username, otp : VerifyCode})
  });
        return { success:true,message:"Verification email send Successfully"}

        
    }   catch (emailError) {
        console.log('Error sending verification Email',emailError);
        return { success:false,message:"Failed to send Verification email"}
    }
}
