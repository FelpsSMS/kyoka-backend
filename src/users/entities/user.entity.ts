import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true, indexed: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: uuidv4() })
  resetCode: string;

  @Prop({ required: true, default: Date.now })
  resetTimer: number;

  @Prop({ required: true, default: false })
  isVerified: boolean;

  //reset time will be the same for everyone for now

  @Prop({ required: true, default: 10 })
  numberOfNewCards: number;

  @Prop({ required: true, default: 8 })
  lapseThreshold: number;

  @Prop({ required: true, default: false })
  removeLeeches: boolean;

  //start date can be determined by a cookie
}

export const UserSchema = SchemaFactory.createForClass(User);
