import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateDeckStatDto } from "./dto/create-deck-stat.dto";
import { UpdateDeckStatDto } from "./dto/update-deck-stat.dto";
import { DeckStat, DeckStatDocument } from "./entities/deck-stat.entity";

@Injectable()
export class DeckStatsService {
  constructor(
    @InjectModel(DeckStat.name) private deckStatModel: Model<DeckStatDocument>,
  ) {}

  create(createDeckStatDto: CreateDeckStatDto) {
    const deckStat = new this.deckStatModel(createDeckStatDto);

    return deckStat.save();
  }

  getDecksByUser(body: any) {
    return this.deckStatModel.find({ user: body.userId });
  }

  getSRSStats(body: any) {
    return this.deckStatModel.find({ deck: body.deckId });
  }

  findAll() {
    return `This action returns all deckStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deckStat`;
  }

  update(id: number, updateDeckStatDto: UpdateDeckStatDto) {
    return `This action updates a #${id} deckStat`;
  }

  remove(id: number) {
    return `This action removes a #${id} deckStat`;
  }
}
