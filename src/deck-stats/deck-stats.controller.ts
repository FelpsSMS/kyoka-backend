import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { DeckStatsService } from "./deck-stats.service";
import { CreateDeckStatDto } from "./dto/create-deck-stat.dto";
import { UpdateDeckStatDto } from "./dto/update-deck-stat.dto";

@Controller("deck-stats/")
export class DeckStatsController {
  constructor(private readonly deckStatsService: DeckStatsService) {}

  @Post()
  create(@Body() createDeckStatDto: CreateDeckStatDto) {
    return this.deckStatsService.create(createDeckStatDto);
  }

  @Post("user")
  getDecksByUser(@Body() body: any) {
    return this.deckStatsService.getDecksByUser(body);
  }

  @Post("stats")
  getSRSStats(@Body() body: any) {
    return this.deckStatsService.getSRSStats(body);
  }

  @Post("delete-by-deck-and-user-id")
  deleteStatsByDeck(@Body() body: any) {
    return this.deckStatsService.deleteStatsByDeckAndUser(body);
  }

  @Post("authenticate-deletion")
  authenticateDeletion(@Body() body: any) {
    return this.deckStatsService.authenticateDeletion(body);
  }

  @Post("update")
  updateActive(@Body() body: any) {
    return this.deckStatsService.updateActive(body);
  }

  /*   @Get()
  findAll() {
    return this.deckStatsService.findAll();
  } */

  /*   @Get(":id")
  findOne(@Param("id") id: string) {
    return this.deckStatsService.findOne(+id);
  } */

  /*   @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateDeckStatDto: UpdateDeckStatDto,
  ) {
    return this.deckStatsService.update(id, updateDeckStatDto);
  } */

  /*   @Delete(":id")
  remove(@Param("id") id: string) {
    return this.deckStatsService.remove(id);
  } */
}
