import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type DictionaryDocument = Dictionary & Document;

@Schema()
export class Dictionary {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  name: string;
}

export const DictionarySchema = SchemaFactory.createForClass(Dictionary);
