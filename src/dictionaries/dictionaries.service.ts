import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateDictionaryDto } from "./dto/create-dictionary.dto";
import { UpdateDictionaryDto } from "./dto/update-dictionary.dto";
import { Dictionary, DictionaryDocument } from "./entities/dictionary.entity";

@Injectable()
export class DictionariesService {
  constructor(
    @InjectModel(Dictionary.name)
    private DictionaryModel: Model<DictionaryDocument>,
  ) {}

  create(createDictionaryDto: CreateDictionaryDto) {
    const Dictionary = new this.DictionaryModel(createDictionaryDto);

    return Dictionary.save();
  }

  async getDictsByUser(body: any) {
    return this.DictionaryModel.find({
      user: body.user,
    }).exec();
  }

  findOne(id: string) {
    return this.DictionaryModel.findById(id);
  }

  update(id: number, updateDictionaryDto: UpdateDictionaryDto) {
    return `This action updates a #${id} dictionary`;
  }

  remove(id: number) {
    return `This action removes a #${id} dictionary`;
  }
}
