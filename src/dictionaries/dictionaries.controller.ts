import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { DictionariesService } from "./dictionaries.service";
import { CreateDictionaryDto } from "./dto/create-dictionary.dto";
import { UpdateDictionaryDto } from "./dto/update-dictionary.dto";

@Controller("dictionaries")
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @Post()
  create(@Body() createDictionaryDto: CreateDictionaryDto) {
    return this.dictionariesService.create(createDictionaryDto);
  }

  @Post("by-user")
  getDictsByUser(@Body() body: any) {
    return this.dictionariesService.getDictsByUser(body);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.dictionariesService.findOne(id);
  }
}
