import { Module } from "@nestjs/common";
import { DecksService } from "./decks.service";
import { DecksController } from "./decks.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Deck, DeckSchema } from "./entities/deck.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
  ],
  controllers: [DecksController],
  providers: [DecksService],
})
export class DecksModule {}
