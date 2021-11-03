import { Controller, Get, Param, Post } from "@nestjs/common";
import { DecksService } from "src/decks/decks.service";

@Controller("deck-stats/deck")
export class DeckDeckStatsController {
  constructor(private readonly deckService: DecksService) {}

  @Post()
  getDecks(@Param("deckId") deckId: string) {
    return this.deckService.getDecksForUser(deckId);
  }
}
