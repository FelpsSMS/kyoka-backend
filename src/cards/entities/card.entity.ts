import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CardDocument = Card & Document;

@Schema()
export class Card {
  @Prop()
  sentence: string;

  @Prop()
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

  @Prop()
  deck: string;

  @Prop({ default: Date.now })
  dateAdded: Date;

  @Prop({ default: Date.now })
  dateDue: Date;

  @Prop({ default: 0 })
  lapses: number;
}

export const CardSchema = SchemaFactory.createForClass(Card);
