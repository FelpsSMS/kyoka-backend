import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DeckDocument = Deck & Document;

@Schema()
export class Deck {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  creator: string;

  @Prop({ required: true, default: false })
  shared: boolean;

  @Prop({ required: true })
  subject: string;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
