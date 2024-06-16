import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema()
export class User extends Document {
    id: string;
    name:string;
    password: string;
    email: string;
    role: string;

    
}

export const UserSchema = SchemaFactory.createForClass(User);