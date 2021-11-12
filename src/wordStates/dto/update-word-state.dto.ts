import { PartialType } from "@nestjs/mapped-types";
import { CreateWordStateDto } from "./create-word-state.dto";

export class UpdateWordStateDto extends PartialType(CreateWordStateDto) {}
