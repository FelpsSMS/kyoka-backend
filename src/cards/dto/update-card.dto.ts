import { PartialType } from "@nestjs/mapped-types";
import { Prop } from "@nestjs/mongoose";
import { CreateCardDto } from "./create-card.dto";

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @Prop()
  imageStrings?: string[];
}
