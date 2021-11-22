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
  forgot(@Body() { email, locale }: any) {
    return this.usersService.forgot(email, locale);
  }

  @Post("email-verification")
  sendEmailVerification(@Body() { email, locale }: any) {
    return this.usersService.sendEmailVerification(email, locale);
  }

  //@Redirect(process.env.APP_HOST)
  @Get(":resetCode/:locale")
  resetPassword(
    @Param("resetCode") resetCode: string,
    @Param("locale") locale: string,
    @Res() res,
  ) {
    console.log("password reset");

    this.usersService.resetPassword(resetCode, locale);

    res.status(301).redirect(process.env.APP_HOST);
  }

  @Get("email-verification/:resetCode/:locale")
  verifyAccount(
    @Param("resetCode") resetCode: string,
    @Param("locale") locale: string,
    @Res() res,
  ) {
    this.usersService.verifyAccount(resetCode, locale);

    res.status(301).redirect(process.env.APP_HOST);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post("user-info")
  findUserById(@Body() body: any) {
    return this.usersService.findUserById(body.id);
  }

  @Post("update-user-info")
  updateUserInfo(@Body() body: any) {
    return this.usersService.updateUserInfo(body);
  }

  @Post("update-active-dictionary")
  updateActiveDictionary(@Body() body: any) {
    return this.usersService.updateActiveDictionary(body);
  }

  @Post("update-password")
  updatePassword(@Body() body: any) {
    return this.usersService.updatePassword(body);
  }
}
