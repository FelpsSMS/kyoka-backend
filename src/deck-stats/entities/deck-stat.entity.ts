import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type DeckStatDocument = DeckStat & Document;

@Schema()
export class DeckStat {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  deck: string;

  @Prop({ required: true })
  readOnly: boolean;

  @Prop({ required: true, default: true })
  active: boolean;
}

export const DeckStatSchema = SchemaFactory.createForClass(DeckStat);
