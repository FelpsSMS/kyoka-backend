import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CardDocument = Card & Document;

@Schema()
export class Card {
  @Prop({ required: true })
  creator: string;

  @Prop()
  sentence: string;

  @Prop({ required: true })
  focus: string;

  @Prop()
  bilingualDescription: string;

  @Prop()
  monolingualDescription: string;

  @Prop()
  sentenceAudio: string[];

  @Prop()
  focusAudio: string[];

  @Prop()
  translation: string;

  @Prop()
  notes: string;

  @Prop()
  images: string[];

  @Prop({ required: true })
  deck: string;

  @Prop({ default: Date.now })
  dateAdded: Date;
}

export const CardSchema = SchemaFactory.createForClass(Card);
