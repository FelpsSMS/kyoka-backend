import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from "@nestjs/common";
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from "@nestjs/platform-express";
import { CardsService } from "./cards.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";

@Controller("cards")
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "image", maxCount: 5 },
      { name: "sentence_audio", maxCount: 1 },
      { name: "focus_audio", maxCount: 1 },
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

  @Get()
  getCardsByDeckId(@Param("DeckId") deckId: string) {
    return "Get cards by deck id";
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
