import { Module } from "@nestjs/common";
import { DeckStatsService } from "./deck-stats.service";
import { DeckStatsController } from "./deck-stats.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { DeckStat, DeckStatSchema } from "./entities/deck-stat.entity";
import { DecksModule } from "src/decks/decks.module";
import { DeckDeckStatsController } from "./deckDeckStats.controller";
import { DecksService } from "src/decks/decks.service";

@Module({
  imports: [
    DecksModule,
    MongooseModule.forFeature([
      { name: DeckStat.name, schema: DeckStatSchema },
    ]),
  ],
  controllers: [DeckStatsController, DeckDeckStatsController],
  providers: [DeckStatsService],
})
export class DeckStatsModule {}
