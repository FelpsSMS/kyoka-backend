import { Module } from "@nestjs/common";
import { LayoutConfigsService } from "./layout-configs.service";
import { LayoutConfigsController } from "./layout-configs.controller";
import {
  LayoutConfig,
  LayoutConfigSchema,
} from "./entities/layout-config.entity";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LayoutConfig.name, schema: LayoutConfigSchema },
    ]),
  ],
  controllers: [LayoutConfigsController],
  providers: [LayoutConfigsService],
})
export class LayoutConfigsModule {}
