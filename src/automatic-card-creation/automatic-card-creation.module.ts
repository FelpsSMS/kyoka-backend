import { Module } from "@nestjs/common";
import { AutomaticCardCreationController } from "./automatic-card-creation.controller";
import { AutomaticCardCreationService } from "./automatic-card-creation.service";

@Module({
  controllers: [AutomaticCardCreationController],
  providers: [AutomaticCardCreationService],
})
export class AutomaticCardCreationModule {}
