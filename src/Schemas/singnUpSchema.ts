import {z} from 'zod'

export const useranmeValidation = z
.string()
.min(2,'Username must be at least 2 characters ')
.max(20,'Username must be no more 20 characters')
.regex(/^[a-zA-Z0-9._]{3,20}$/, 'Username Must not contain Special characters')


export const sighnUoSchema = z.object({
    username: useranmeValidation,
    email : z.string().email({message : 'Invalid email address'}),
    password : z.string().min(6,{message : 'password must be at least 6 characters'}),

})