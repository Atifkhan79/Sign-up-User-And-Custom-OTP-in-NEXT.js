import mongoose, {Schema,Document} from 'mongoose';
import { unique } from 'next/dist/build/utils';

export interface Message extends Document{
    content : string;
    createdAt : Date
}


const MessageSchema: Schema<Message> = new Schema({

    content : {
        type : String,
        required : true
    },
    createdAt: {
        type : Date,
        required: true,
        default : Date.now()
    }
})

export interface User extends Document{
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessage : boolean;
    message : Message[]
}
const UserSchema : Schema <User> = new Schema({
    username : {
        type : String,
        required : [true,'Username is required'],
        unique : true,
        trim : true

    },
    email : {
        type : String,
        required : [true,'Email is required'],
        unique : true,
        match : [/.+\@.+\..+/, 'PLease used a clid email address']

    },
    password : {
        type : String ,
        required : [true,'Passwrod is required']
    },
    verifyCode : {
        type  : String,
        required : [true,'Verify Code is required']

    },
    verifyCodeExpiry : {
        type : Date,
        required : [true,'Verify Code Expiry is required ']
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    message : [MessageSchema]
})  


const UserModel = (mongoose.models.User as mongoose.
Model<User>) || mongoose.model<User>('User',UserSchema)

export default UserModel