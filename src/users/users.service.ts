import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "./entities/user.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const plainTextPassword = createUserDto["password"];
    const hash = await bcrypt.hash(plainTextPassword, saltOrRounds);

    createUserDto["password"] = hash;

    const user = new this.userModel(createUserDto);

    user.save();

    console.log("Salvo");
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.userModel
      .findOne({ email: createUserDto["email"] })
      .exec();

    let success = false;

    if (user) {
      const isMatch = await bcrypt.compare(
        createUserDto["password"],
        user.password,
      );

      success = isMatch;
    } else {
      success = false;
    }

    return { success: success };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
