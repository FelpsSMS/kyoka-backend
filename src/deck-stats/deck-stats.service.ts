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

  async getSRSStats(body: any) {
    const statsByDeckId: any = await this.deckStatModel
      .find({ deck: body.deckId })
      .exec();

    const statsByDeckIdAndUserId: any = statsByDeckId.filter(
      (item) => item.user == body.userId,
    );

    return statsByDeckIdAndUserId[0];
  }

  async authenticateDeletion(body: any) {
    const statsByDeckId: any = await this.deckStatModel
      .find({ deck: body.deckId })
      .exec();

    const statsByDeckIdAndUserId: any = statsByDeckId.filter(
      (item) => item.user == body.userId,
    );

    let deleteAuth = false;

    if (!statsByDeckIdAndUserId[0].readOnly) {
      deleteAuth = true;
    }

    return deleteAuth;
  }

  async deleteStatsByDeckAndUser(body: any) {
    const statsByDeckId: any = await this.deckStatModel
      .find({ deck: body.deckId })
      .exec();

    const statsByDeckIdAndUserId: any = statsByDeckId.filter(
      (item) => item.user == body.userId,
    );

    let deleteAuth = false;

    await this.remove(statsByDeckIdAndUserId[0]._id);

    if (!statsByDeckIdAndUserId[0].readOnly) {
      deleteAuth = true;
    }

    return deleteAuth;
  }

  findAll() {
    return `This action returns all deckStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deckStat`;
  }

  async updateActive(body: any) {
    const statsByDeckId: any = await this.deckStatModel
      .find({ deck: body.deckId })
      .exec();

    const statsByDeckIdAndUserId: any = statsByDeckId.filter(
      (item) => item.user == body.userId,
    );

    return this.deckStatModel.findByIdAndUpdate(
      {
        _id: statsByDeckIdAndUserId[0]._id,
      },
      {
        $set: body.updateBody,
      },
      {
        new: true,
      },
    );
  }

  /*   async update(id: string, updateDeckStatDto: UpdateDeckStatDto) {
    const statsByDeckId: any = await this.deckStatModel
      .find({ deck: id })
      .exec();

    const statsByDeckIdAndUserId: any = statsByDeckId.filter((item) => item.user == )

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
  } */

  remove(id: string) {
    return this.deckStatModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}
