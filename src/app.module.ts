import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DecksModule } from "./decks/decks.module";
import { CardsModule } from "./cards/cards.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { Cloudinary } from "./cloudinary";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { DeckStatsModule } from "./deck-stats/deck-stats.module";
import { CardStatsModule } from "./card-stats/card-stats.module";
import { SessionModule } from "./session/session.module";
import { DictionariesModule } from "./dictionaries/dictionaries.module";
import { WordStateModule } from "./wordStates/word-state.module";
import { AutomaticCardCreationModule } from "./automatic-card-creation/automatic-card-creation.module";
import { LayoutsModule } from "./layouts/layouts.module";
import { LayoutConfigsModule } from "./layout-configs/layout-configs.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_CONN, {
      useCreateIndex: true,
      autoIndex: true,
      useFindAndModify: false,
    }),
    DecksModule,
    CardsModule,
    CloudinaryModule,
    UsersModule,
    DeckStatsModule,
    CardStatsModule,
    SessionModule,
    DictionariesModule,
    WordStateModule,
    AutomaticCardCreationModule,
    LayoutsModule,
    LayoutConfigsModule,
  ],
  controllers: [],
  providers: [Cloudinary],
})
export class AppModule {}
