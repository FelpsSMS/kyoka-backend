import { Module } from "@nestjs/common";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { AutomaticCardCreationController } from "./automatic-card-creation.controller";
import { AutomaticCardCreationService } from "./automatic-card-creation.service";

@Module({
  imports: [CloudinaryModule],
  controllers: [AutomaticCardCreationController],
  providers: [AutomaticCardCreationService],
})
export class AutomaticCardCreationModule {}
