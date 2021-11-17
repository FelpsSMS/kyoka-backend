import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CardDocument = Card & Document;

@Schema()
export class Card {
  @Prop({ required: true })
  creator: string;

  @Prop({ required: true })
  deck: string;

  @Prop({ default: Date.now })
  dateAdded: Date;

  @Prop()
  layoutInfo: any[];
}

export const CardSchema = SchemaFactory.createForClass(Card);
