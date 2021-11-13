import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { CreateDeckDto } from "./dto/create-deck.dto";
import { UpdateDeckDto } from "./dto/update-deck.dto";
import { Deck, DeckDocument } from "./entities/deck.entity";

@Injectable()
export class DecksService {
  constructor(@InjectModel(Deck.name) private deckModel: Model<DeckDocument>) {}

  create(createDeckDto: CreateDeckDto) {
    const deck = new this.deckModel(createDeckDto);

    return deck.save();
  }

  async authenticateDeletion(body: any) {
    const deck: any = await this.deckModel.findById(body.id).exec();

    if (deck.creator == body.creator) {
      return this.remove(body.id);
    } else {
      const message = "Deletion failed: User not authorized";

      console.log(message);
      return message;
    }
  }

  async getDecksByCreator(body: any) {
    const decks = await this.deckModel.find({ creator: body.userId }).exec();

    return decks;
  }
  async getSharedDecks() {
    const sharedDecks = await this.deckModel.find({ shared: true }).exec();
    return sharedDecks;
  }

  findAll() {
    return this.deckModel.find();
  }

  findOne(id: string) {
    return this.deckModel.findById(id);
  }

  update(id: string, updateDeckDto: UpdateDeckDto) {
    return this.deckModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateDeckDto,
      },
      {
        new: true,
      },
    );
  }

  getDecksForUser(deckId: string) {
    return this.deckModel.findById(deckId);
  }

  remove(id: string) {
    return this.deckModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}
