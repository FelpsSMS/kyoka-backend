import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true, default: Date.now })
  startTime: number;

  @Prop({ required: true, default: Date.now })
  endTime: number;

  @Prop({ required: true, default: 0 })
  numberOfMatureCardsReviewed: number;

  @Prop({ required: true, default: 0 })
  numberOfFailsOnMatureCards: number;

  @Prop({ required: true, default: 0 })
  numberOfCardsReviewed: number;

  @Prop({ required: true, default: 0 })
  numberOfCardsToReview: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
