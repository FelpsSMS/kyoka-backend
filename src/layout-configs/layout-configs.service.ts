import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateLayoutConfigDto } from "./dto/create-layout-config.dto";
import { UpdateLayoutConfigDto } from "./dto/update-layout-config.dto";
import {
  LayoutConfig,
  LayoutConfigDocument,
} from "./entities/layout-config.entity";

@Injectable()
export class LayoutConfigsService {
  constructor(
    @InjectModel(LayoutConfig.name)
    private layoutConfigModel: Model<LayoutConfigDocument>,
  ) {}

  create(createLayoutConfigDto: CreateLayoutConfigDto) {
    return this.layoutConfigModel.create(createLayoutConfigDto);
  }

  async getConfigByLayout(body: any) {
    return this.layoutConfigModel
      .find({
        layout: body.id,
      })
      .exec();
  }

  findAll() {
    return `This action returns all layoutConfigs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} layoutConfig`;
  }

  update(id: number, updateLayoutConfigDto: UpdateLayoutConfigDto) {
    return `This action updates a #${id} layoutConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} layoutConfig`;
  }
}
