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

  async getStatsByCard(body: any) {
    const statsByCardId: any = await this.cardStatModel
      .find({ card: body.cardId })
      .exec();

    const statsByCardIdAndUserId: any = statsByCardId.filter(
      (item) => item.user == body.userId,
    );

    return statsByCardIdAndUserId[0];
  }

  async deleteStatsByCardAndUser(body: any) {
    const statsByCardId: any = await this.cardStatModel
      .find({ card: body.cardId })
      .exec();

    const statsByCardIdAndUserId: any = statsByCardId.filter(
      (item) => item.user == body.userId,
    );

    let deleteAuth = false;

    if (!body.readOnly) {
      deleteAuth = true;
      await this.remove(statsByCardIdAndUserId[0]._id);
    }

    return deleteAuth;
  }

  calculateSRSStats(body: any) {
    const result = srsalgo({
      repetitions: body.repetitions,
      efactor: body.efactor,
      //dueDate: body.dueDate,
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

  remove(id: string) {
    return this.cardStatModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}
