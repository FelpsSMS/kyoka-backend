import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateLayoutDto } from "./dto/create-layout.dto";
import { UpdateLayoutDto } from "./dto/update-layout.dto";
import { Layout, LayoutDocument } from "./entities/layout.entity";

@Injectable()
export class LayoutsService {
  constructor(
    @InjectModel(Layout.name) private layoutModel: Model<LayoutDocument>,
  ) {}

  create(createLayoutDto: CreateLayoutDto) {
    const layout = new this.layoutModel(createLayoutDto);

    return layout.save();
  }

  findAll() {
    return this.layoutModel.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} layout`;
  }

  update(id: number, updateLayoutDto: UpdateLayoutDto) {
    return `This action updates a #${id} layout`;
  }

  remove(id: number) {
    return `This action removes a #${id} layout`;
  }
}
