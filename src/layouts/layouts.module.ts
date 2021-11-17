import { Module } from "@nestjs/common";
import { LayoutsService } from "./layouts.service";
import { LayoutsController } from "./layouts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Layout, LayoutSchema } from "./entities/layout.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Layout.name, schema: LayoutSchema }]),
  ],
  controllers: [LayoutsController],
  providers: [LayoutsService],
})
export class LayoutsModule {}
