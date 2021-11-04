import { Module } from "@nestjs/common";
import { CardStatsService } from "./card-stats.service";
import { CardStatsController } from "./card-stats.controller";
import { CardStat, CardStatSchema } from "./entities/card-stat.entity";
import { MongooseModule } from "@nestjs/mongoose";
import { CardsModule } from "src/cards/cards.module";

@Module({
  imports: [
    CardsModule,
    MongooseModule.forFeature([
      { name: CardStat.name, schema: CardStatSchema },
    ]),
  ],
  controllers: [CardStatsController],
  providers: [CardStatsService],
})
export class CardStatsModule {}
