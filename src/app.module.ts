import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DecksModule } from "./decks/decks.module";
import { CardsModule } from "./cards/cards.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { Cloudinary } from "./cloudinary";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_CONN),
    DecksModule,
    CardsModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [Cloudinary],
})
export class AppModule {}
