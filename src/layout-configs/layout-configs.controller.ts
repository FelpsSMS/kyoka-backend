import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { LayoutConfigsService } from "./layout-configs.service";
import { CreateLayoutConfigDto } from "./dto/create-layout-config.dto";
import { UpdateLayoutConfigDto } from "./dto/update-layout-config.dto";

@Controller("layout-configs")
export class LayoutConfigsController {
  constructor(private readonly layoutConfigsService: LayoutConfigsService) {}

  @Post()
  create(@Body() createLayoutConfigDto: CreateLayoutConfigDto) {
    return this.layoutConfigsService.create(createLayoutConfigDto);
  }

  @Post("by-layout")
  getConfigByLayout(@Body() body: any) {
    return this.layoutConfigsService.getConfigByLayout(body);
  }

  @Get()
  findAll() {
    return this.layoutConfigsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.layoutConfigsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateLayoutConfigDto: UpdateLayoutConfigDto,
  ) {
    return this.layoutConfigsService.update(+id, updateLayoutConfigDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.layoutConfigsService.remove(+id);
  }
}
