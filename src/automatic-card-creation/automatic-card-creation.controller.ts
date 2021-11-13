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
import axios from "axios";

@Controller("automatic-card-creation")
export class AutomaticCardCreationController {
  constructor(
    private readonly automaticCardCreationService: AutomaticCardCreationService,
  ) {}

  @Post("details")
  async getDetails(@Body() body: any) {
    const response = await axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${body.focus}`)
      .then((res) => {
        console.log(res);

        if (res.data) {
          console.log(res);

          console.log(res.data);
          console.log(res.data[0].phonetics);
          console.log(res.data[0].meanings);
          console.log(res.data[0].meanings[0].definitions);

          console.log("----------------------------------------------");

          console.log(res.data[0].phonetics[0].audio);
          console.log(res.data[0].meanings[0].partOfSpeech);
          console.log(res.data[0].meanings[0].definitions[0].definition);
          console.log(res.data[0].meanings[0].definitions[0].example);

          const audio = res.data[0].phonetics[0].audio;
          const word = res.data[0].word;
          const definition = res.data[0].meanings[0].definitions[0].definition;
          const example = res.data[0].meanings[0].definitions[0].example;

          return { audio, word, definition, example };
        }
      })
      .catch((err) => {
        console.log(err);

        return undefined;
      });

    return response;
    //api for example sentences

    //api for text to speech

    //api for images
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
