import { Controller, Get, Param } from "@nestjs/common";
import { CardsService } from "src/cards/cards.service";

@Controller("decks/:deckId/cards")
export class CardDeckController {
  constructor(private readonly cardService: CardsService) {}

  @Get()
  getCards(@Param("deckId") deckId: string) {
    return this.cardService.getCardsByDeckId(deckId);
  }
}
