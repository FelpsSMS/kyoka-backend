import { Module } from "@nestjs/common";
import { DictionariesService } from "./dictionaries.service";
import { DictionariesController } from "./dictionaries.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Dictionary, DictionarySchema } from "./entities/dictionary.entity";

@Module({
  imports: [
    DictionariesModule,
    MongooseModule.forFeature([
      { name: Dictionary.name, schema: DictionarySchema },
    ]),
  ],
  controllers: [DictionariesController],
  providers: [DictionariesService],
})
export class DictionariesModule {}
