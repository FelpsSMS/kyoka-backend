import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type LayoutDocument = Layout & Document;

@Schema()
export class Layout {
  @Prop({ required: true })
  name: string;
}

export const LayoutSchema = SchemaFactory.createForClass(Layout);
