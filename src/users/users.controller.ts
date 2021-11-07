import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("login")
  login(@Body() createUserDto: CreateUserDto) {
    return this.usersService.login(createUserDto);
  }

  @Post("forgot")
  forgot(@Body() { email }: any) {
    return this.usersService.forgot(email);
  }

  //@Redirect(process.env.APP_HOST)
  @Get(":resetCode")
  resetPassword(@Param("resetCode") resetCode: string, @Res() res) {
    this.usersService.resetPassword(resetCode);

    res.redirect(process.env.APP_HOST);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post("user-info")
  findUserById(@Body() body: any) {
    return this.usersService.findUserById(body.id);
  }

  @Post("update-user-info")
  updateUserInfo(@Body() body: any) {
    return this.usersService.updateUserInfo(body);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
