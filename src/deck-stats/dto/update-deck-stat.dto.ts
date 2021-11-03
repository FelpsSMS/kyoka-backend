import { PartialType } from "@nestjs/mapped-types";
import { CreateDeckStatDto } from "./create-deck-stat.dto";

export class UpdateDeckStatDto extends PartialType(CreateDeckStatDto) {}
