import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { srsalgo } from "src/srsalgo";
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

  calculateSRSStats(body: any) {
    const result = srsalgo({
      repetitions: body.repetitions,
      efactor: body.efactor,
      dueDate: body.dueDate,
      pass: body.pass,
    });

    return this.update(body.statId, {
      repetitions: result.repetitions,
      efactor: result.newEfactor,
      dueDate: result.newDueDate,
    });
  }

  findAll() {
    return `This action returns all cardStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cardStat`;
  }

  update(id: string, updateCardStatDto: UpdateCardStatDto) {
    return this.cardStatModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateCardStatDto,
      },
      {
        new: true,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} cardStat`;
  }
}
