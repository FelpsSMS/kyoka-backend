import { Module } from "@nestjs/common";
import { DecksService } from "./decks.service";
import { DecksController } from "./decks.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Deck, DeckSchema } from "./entities/deck.entity";
import { CardsModule } from "src/cards/cards.module";
import { CardDeckController } from "./cardDeck.controller";

@Module({
  imports: [
    CardsModule,
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
  ],
  controllers: [DecksController, CardDeckController],
  providers: [DecksService],
  exports: [DecksService],
})
export class DecksModule {}
