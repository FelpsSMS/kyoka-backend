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
    FileFieldsInterceptor([{ name: "images" }, { name: "audios" }]),
  )
  create(
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    //console.log(files);
    //console.log(Object.entries(body));

    return this.cardsService.create(body, files);
  }

  @Post("create-without-files")
  createWithoutFiles(@Body() body: any) {
    return this.cardsService.createWithoutFiles(body);
  }

  @Post("authenticate-deletion-and-delete")
  authenticateDeletion(@Body() body: any) {
    return this.cardsService.authenticateDeletion(body);
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
    return this.cardsService.findOne(id);
  }

  @Patch(":id")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "images", maxCount: 4 },
      { name: "sentence_audio", maxCount: 1 },
      { name: "focus_audio", maxCount: 1 },
    ]),
  )
  update(
    @Param("id") id: string,

    @Body() updateCardDto: UpdateCardDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.cardsService.update(id, updateCardDto, files);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cardsService.remove(id);
  }
}
