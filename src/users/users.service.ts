import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "./entities/user.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as jwt from "jsonwebtoken";
import * as nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

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

  async resetPassword(resetCode: string) {
    const newPassword = uuidv4();

    const saltOrRounds = 10;

    const newPasswordHash = await bcrypt.hash(newPassword, saltOrRounds);

    const user = await this.userModel.findOne({ resetCode: resetCode }).exec();

    if (Date.now() < user.resetTimer) {
      console.log("Password changed successfully");

      this.sendMail(
        user.email,
        ``,
        "Kyoka: Redefinição de senha",
        `<html>
        <body>
          Sua senha foi redefinida com sucesso. Sua senha temporária é <strong>${newPassword}</strong>
          <br>
          Por favor, entre na sua conta e altere essa senha o mais rápido possível.
        </body>
      </html>`,
      );

      return this.update(user._id, {
        password: newPasswordHash,
        resetTimer: Date.now(),
        resetCode: uuidv4(),
      });
    } else {
      console.log("Expired");
    }
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.userModel
      .findOne({ email: createUserDto["email"] })
      .exec();

    let success = false;
    let token = null;

    if (user) {
      const isMatch = await bcrypt.compare(
        createUserDto["password"],
        user.password,
      );

      success = isMatch;

      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } else {
      success = false;
    }

    return { success: success, token: token };
  }

  async mailConfig() {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,

      secure: false,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      tls: {
        rejectUnauthorized: false,
      },
    });

    return transporter;
  }

  async sendMail(email: string, text: string, subject: string, html?: string) {
    const transporter = await this.mailConfig();

    const mailSent = await transporter.sendMail({
      text: text,
      subject: subject,
      from: "Kyoka <kyokadonotreply@gmail.com>",
      to: email,
      html: html || null,
    });
  }

  async forgot(email: any) {
    const user = await this.userModel.findOne({ email: email }).exec();
    let success = false;

    if (user) {
      const newCode = uuidv4();
      const newResetTimer = Date.now() + 298999; //5 minutes in milliseconds

      await this.enableReset(user._id, newResetTimer, newCode);

      this.sendMail(
        email,
        ``,
        "Kyoka: Redefinição de senha",
        `<html>
          <body>
            Uma solicitação de redefinição de senha foi feita com o seu e-mail, clique no link abaixo 
            para redefinir sua senha. O link fornecido expirará em 5 minutos.
            <br>
            Caso você não tenha feito esta solicitação, por favor, 
            ignore esta mensagem.
            <br>
            <br>
            <a href=${process.env.PUBLIC_API_ENDPOINT}/users/${newCode}>Clique aqui</a>
          </body>
        </html>`,
      );

      success = true;
    }

    return { success: success };
  }

  async enableReset(id: string, newTime: number, newCode: string) {
    return this.update(id, { resetTimer: newTime, resetCode: newCode });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateUserDto,
      },
      {
        new: true,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
