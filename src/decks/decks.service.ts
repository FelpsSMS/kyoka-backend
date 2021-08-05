import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { CreateDeckDto } from "./dto/create-deck.dto";
import { UpdateDeckDto } from "./dto/update-deck.dto";
import { Deck, DeckDocument } from "./entities/deck.entity";

@Injectable()
export class DecksService {
  constructor(
    //@InjectConnection("decks") private connection: Connection,
    @InjectModel(Deck.name) private deckModel: Model<DeckDocument>,
  ) {}

  create(createDeckDto: CreateDeckDto) {
    const deck = new this.deckModel(createDeckDto);

    return deck.save();
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

  remove(id: string) {
    return this.deckModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}
