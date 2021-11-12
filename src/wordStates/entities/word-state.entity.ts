import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type WordStateDocument = WordState & Document;

@Schema()
export class WordState {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  state: number;

  @Prop({ required: true })
  word: string;
}

export const WordStateSchema = SchemaFactory.createForClass(WordState);
