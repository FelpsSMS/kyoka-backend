import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";

import { WordStatesService } from "./word-state-service";

@Controller("word-states")
export class WordStatesController {
  constructor(private readonly wordStatesService: WordStatesService) {}

  @Post("by-user")
  getWordsByUser(@Body() body: any) {
    return this.wordStatesService.getWordsByUser(body);
  }

  @Post("set-word")
  setWordState(@Body() body: any) {
    return this.wordStatesService.setWordState(body);
  }
}
