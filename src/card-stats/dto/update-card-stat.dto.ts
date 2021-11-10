import { PartialType } from "@nestjs/mapped-types";
import { CreateCardStatDto } from "./create-card-stat.dto";

export class UpdateCardStatDto extends PartialType(CreateCardStatDto) {}
