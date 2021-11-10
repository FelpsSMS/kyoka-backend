import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { SessionService } from "./session.service";

@Controller("session")
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Post("last-session")
  getLastSession(@Body() body: any) {
    return this.sessionService.getLastSession(body);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.sessionService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSessionDto: UpdateSessionDto) {
    console.log("patch");
    return this.sessionService.update(id, updateSessionDto);
  }
}
