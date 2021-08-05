import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DeckDocument = Deck & Document;

@Schema()
export class Deck {
  @Prop()
  name: string;

  @Prop()
  cards: string;

  @Prop()
  numberOfCards: number;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
