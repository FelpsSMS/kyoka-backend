import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { WSAEPROVIDERFAILEDINIT } from "constants";
import { Model } from "mongoose";
import { CreateWordStateDto } from "./dto/create-word-state.dto";
import { UpdateWordStateDto } from "./dto/update-word-state.dto";

import { WordState, WordStateDocument } from "./entities/word-state.entity";

@Injectable()
export class WordStatesService {
  constructor(
    @InjectModel(WordState.name)
    private wordStateModel: Model<WordStateDocument>,
  ) {}

  create(createWordStateDto: CreateWordStateDto) {
    const WordState = new this.wordStateModel(createWordStateDto);

    return WordState.save();
  }

  async getWordsByUser(body: any) {
    return this.wordStateModel
      .find({
        user: body.user,
      })
      .exec();
  }

  async setWordState(body: any) {
    const allWords = await this.wordStateModel
      .find({
        user: body.user,
      })
      .exec();

    const word: any = allWords.filter((item) => item.word == body.word);

    if (word[0]) {
      let newState = word[0].state;

      if (word[0].state < 2) {
        newState += 1;
      } else {
        newState = 0;
      }

      return this.update(word[0]._id, { state: newState });
    } else {
      return this.create({ user: body.user, word: body.word, state: 1 });
    }
  }

  findOne(word: string) {
    return this.wordStateModel.find({ word: word });
  }

  update(id: string, updateWordStateDto: UpdateWordStateDto) {
    return this.wordStateModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateWordStateDto,
      },
      {
        new: true,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} WordState`;
  }
}
