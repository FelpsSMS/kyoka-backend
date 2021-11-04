import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type CardStatDocument = CardStat & Document;

@Schema()
export class CardStat {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  card: string;

  @Prop({ required: true, default: Date.now })
  dueDate: number;

  @Prop({ required: true, default: 0 })
  consecutiveLapses: number;

  @Prop({ required: true, default: 0 })
  failCount: number;

  @Prop({ required: true, default: 0 })
  passCount: number;

  @Prop({ required: true, default: 0 })
  totalLapses: number;

  @Prop({ required: true, default: 0 }) //states: 0 - queued, 1 - new, 2 - learning, 3 - relearning, 4 - reviewing
  state: number;

  @Prop({ required: true, default: false })
  mature: boolean;

  @Prop({ required: true, default: false })
  leech: boolean;
}

export const CardStatSchema = SchemaFactory.createForClass(CardStat);
