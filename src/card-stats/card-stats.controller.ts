import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CardStatsService } from "./card-stats.service";
import { CreateCardStatDto } from "./dto/create-card-stat.dto";
import { UpdateCardStatDto } from "./dto/update-card-stat.dto";

@Controller("card-stats")
export class CardStatsController {
  constructor(private readonly cardStatsService: CardStatsService) {}

  @Post()
  create(@Body() createCardStatDto: CreateCardStatDto) {
    return this.cardStatsService.create(createCardStatDto);
  }

  @Post("card")
  getStatsByCard(@Body() body: any) {
    return this.cardStatsService.getStatsByCard(body);
  }

  @Get()
  findAll() {
    return this.cardStatsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cardStatsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCardStatDto: UpdateCardStatDto,
  ) {
    return this.cardStatsService.update(+id, updateCardStatDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cardStatsService.remove(+id);
  }
}
