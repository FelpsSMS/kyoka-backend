import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true, indexed: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: uuidv4() })
  resetCode: string;

  @Prop({ default: Date.now })
  resetTimer: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
