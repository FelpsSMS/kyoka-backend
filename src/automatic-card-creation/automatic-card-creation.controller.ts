import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { AutomaticCardCreationService } from "./automatic-card-creation.service";

@Controller("automatic-card-creation")
export class AutomaticCardCreationController {
  constructor(
    private readonly automaticCardCreationService: AutomaticCardCreationService,
  ) {}

  @Post("generate-card")
  async generateCard(@Body() body: any) {
    return this.automaticCardCreationService.generateCard(body);
  }

  @Post("get-audio")
  async getAudio(@Body() body: any) {
    return this.automaticCardCreationService.getAudio(body);
  }

  /*   @Post("by-user")
  getWordsByUser(@Body() body: any) {
    return this.wordStatesService.getWordsByUser(body);
  }

  @Post("set-word")
  setWordState(@Body() body: any) {
    return this.wordStatesService.setWordState(body);
  } */
}
