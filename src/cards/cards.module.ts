import { Module } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { CardsController } from "./cards.controller";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Card, CardSchema } from "./entities/card.entity";

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
  exports: [CardsService],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
