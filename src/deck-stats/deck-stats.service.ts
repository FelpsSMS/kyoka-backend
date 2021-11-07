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

  async deleteStatsByDeck(body: any) {
    const stats: any = await this.deckStatModel
      .find({ deck: body.deckId })
      .exec();

    if (!stats[0].readOnly) return this.remove(stats[0]._id);
  }

  findAll() {
    return `This action returns all deckStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deckStat`;
  }

  async updateActive(body: any) {
    const stats: any = await this.deckStatModel
      .find({ deck: body.deckId })
      .exec();

    console.log(stats[0]);
    console.log(body.updateBody);

    return this.deckStatModel.findByIdAndUpdate(
      {
        _id: stats[0]._id,
      },
      {
        $set: body.updateBody,
      },
      {
        new: true,
      },
    );
  }

  async update(id: string, updateDeckStatDto: UpdateDeckStatDto) {
    const stats: any = await this.deckStatModel.find({ deck: id }).exec();

    return this.deckStatModel.findByIdAndUpdate(
      {
        _id: stats._id,
      },
      {
        $set: updateDeckStatDto,
      },
      {
        new: true,
      },
    );
  }

  remove(id: string) {
    return this.deckStatModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}
