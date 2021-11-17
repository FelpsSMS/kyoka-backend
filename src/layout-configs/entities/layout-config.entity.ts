import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type LayoutConfigDocument = LayoutConfig & Document;

@Schema()
export class LayoutConfig {
  @Prop({ required: true })
  layout: string;

  @Prop({ required: true })
  fieldName: string;

  @Prop({ required: true })
  fieldType: number; //0 - text, 1 - text area, 2 - audio, 3 - image

  @Prop()
  fieldLabel: string[];

  @Prop({ required: true, default: false })
  required: boolean;
}

export const LayoutConfigSchema = SchemaFactory.createForClass(LayoutConfig);
