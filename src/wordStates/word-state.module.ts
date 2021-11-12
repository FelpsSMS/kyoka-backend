import { Module } from "@nestjs/common";

import { MongooseModule } from "@nestjs/mongoose";
import { WordState, WordStateSchema } from "./entities/word-state.entity";
import { WordStatesController } from "./word-state-controller";
import { WordStatesService } from "./word-state-service";

@Module({
  imports: [
    WordStateModule,
    MongooseModule.forFeature([
      { name: WordState.name, schema: WordStateSchema },
    ]),
  ],
  controllers: [WordStatesController],
  providers: [WordStatesService],
})
export class WordStateModule {}
