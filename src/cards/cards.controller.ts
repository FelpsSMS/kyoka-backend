import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CardsService } from "./cards.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";

@Controller("cards")
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "image1Holder", maxCount: 1 },
      { name: "image2Holder", maxCount: 1 },
      { name: "image3Holder", maxCount: 1 },
      { name: "image4Holder", maxCount: 1 },
      { name: "sentenceAudioHolder", maxCount: 1 },
      { name: "focusAudioHolder", maxCount: 1 },
    ]),
  )
  create(
    @Body() createCardDto: CreateCardDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    //console.log(files);
    return this.cardsService.create(createCardDto, files);
  }

  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  @Get("get_cards/:deck")
  getCardsByDeckId(@Param("deck") deckId: string) {
    return this.cardsService.getCardsByDeckId(deckId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cardsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(+id, updateCardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cardsService.remove(+id);
  }
}
