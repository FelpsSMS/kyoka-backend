import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCardStatDto } from "./dto/create-card-stat.dto";
import { UpdateCardStatDto } from "./dto/update-card-stat.dto";
import { CardStat, CardStatDocument } from "./entities/card-stat.entity";

@Injectable()
export class CardStatsService {
  constructor(
    @InjectModel(CardStat.name) private cardStatModel: Model<CardStatDocument>,
  ) {}

  create(createCardStatDto: CreateCardStatDto) {
    const cardStat = new this.cardStatModel(createCardStatDto);

    return cardStat.save();
  }

  getStatsByCard(body: any) {
    return this.cardStatModel.find({ card: body.cardId });
  }

  findAll() {
    return `This action returns all cardStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cardStat`;
  }

  update(id: number, updateCardStatDto: UpdateCardStatDto) {
    return `This action updates a #${id} cardStat`;
  }

  remove(id: number) {
    return `This action removes a #${id} cardStat`;
  }
}
