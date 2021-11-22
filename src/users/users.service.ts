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

  async findUserById(id: string) {
    const user = await this.userModel.findById(id).exec();

    return {
      numberOfNewCards: user.numberOfNewCards,
      lapseThreshold: user.lapseThreshold,
      removeLeeches: user.removeLeeches,
      activeDictionary: user.activeDictionary,
      defaultDeckForGeneratedCards: user.defaultDeckForGeneratedCards,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const plainTextPassword = createUserDto["password"];
    const hash = await bcrypt.hash(plainTextPassword, saltOrRounds);

    createUserDto["password"] = hash;

    const user = new this.userModel(createUserDto);

    user.save();

    console.log("Saved");
  }

  async resetPassword(resetCode: string, locale: string) {
    const newPassword = uuidv4();

    const saltOrRounds = 10;

    const newPasswordHash = await bcrypt.hash(newPassword, saltOrRounds);

    const user = await this.userModel.findOne({ resetCode: resetCode }).exec();

    console.log("reset password");
    console.log(locale);

    if (Date.now() < user.resetTimer) {
      console.log("Password changed successfully");

      let emailSubject = "";
      let emailBody = "";

      switch (locale) {
        case "pt":
          emailSubject = "Kyoka: Redefinição de senha";
          emailBody = `
          <html>
            <body>
              Sua senha foi redefinida com sucesso. Sua senha temporária é <strong>${newPassword}</strong>
              <br>
              Por favor, entre na sua conta e altere essa senha o mais rápido possível.
            </body>
          </html>`;
          break;

        case "en":
          emailSubject = "Kyoka: Password reset";
          emailBody = `
          <html>
            <body>
              Your password was reset successfully. Your temporary password is <strong>${newPassword}</strong>
              <br>
              Please, log in to your account and change this password as fast as possible.
            </body>
          </html>`;
          break;

        case "ja":
          emailSubject = "Kyoka: パスワードリッセと";
          emailBody = `
          <html>
            <body>
              パスワードは正常にリセットされました。一時的なパスワードとは<strong>${newPassword}</strong>です。
              <br>
              なるべく早くログインしてパスワードを変更してください。
            </body>
          </html>`;
          break;
      }

      this.sendMail(user.email, ``, emailSubject, emailBody);

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
    let isVerified = false;

    if (user) {
      const isMatch = await bcrypt.compare(
        createUserDto["password"],
        user.password,
      );

      success = isMatch;

      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      isVerified = user.isVerified;
    }

    return { success: success, token: token, isVerified: isVerified };
  }

  updateUserInfo(body) {
    return this.update(body.userId, {
      removeLeeches: body.removeLeeches,
      numberOfNewCards: body.numberOfNewCards,
      lapseThreshold: body.lapseThreshold,
      defaultDeckForGeneratedCards: body.defaultDeckForGeneratedCards,
    });
  }

  updateActiveDictionary(body) {
    return this.update(body.userId, {
      activeDictionary: body.activeDictionary,
    });
  }

  async updatePassword(body) {
    const newPassword = body.password;

    const saltOrRounds = 10;

    const newPasswordHash = await bcrypt.hash(newPassword, saltOrRounds);

    return this.update(body.userId, {
      password: newPasswordHash,
    });
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

    await transporter.sendMail({
      text: text,
      subject: subject,
      from: "Kyoka <kyokadonotreply@gmail.com>",
      to: email,
      html: html || null,
    });
  }

  async sendEmailVerification(email: any, locale: any) {
    const user = await this.userModel.findOne({ email: email }).exec();
    let success = false;

    let emailBody = "";
    let emailSubject = "";

    if (user) {
      const newCode = uuidv4();
      const newResetTimer = Date.now() + 298999 * 12 * 24; //24 hours in milliseconds;

      await this.enableReset(user._id, newResetTimer, newCode);

      switch (locale) {
        case "pt":
          emailSubject = "Kyoka: Verificação de conta";
          emailBody = `
          <html>
            <body>
              Por favor, clique no link abaixo para verificar sua conta. Para sua segurança, o link abaixo expirará nas próximas 24 horas.
              <br>
              Caso você não tenha feito esta solicitação, por favor, 
              ignore esta mensagem.
              <br>
              <br>
              <a href=${process.env.PUBLIC_API_ENDPOINT}/users/email-verification/${newCode}/${locale}>Clique aqui</a>
          </body>
        </html>`;
          break;

        case "en":
          emailSubject = "Kyoka: Account verification";
          emailBody = `
          <html>
            <body>
              Please, click the link below to verify your account. For your safety, the link below will expire in the next 24 hours.
              <br>
              If you haven't made this request, please ignore this message.
              <br>
              <br>
              <a href=${process.env.PUBLIC_API_ENDPOINT}/users/email-verification/${newCode}/${locale}>Click here</a>
          </body>
        </html>`;
          break;

        case "ja":
          emailSubject = "Kyoka: アカウント確認";
          emailBody = `
          <html>
            <body>
              アカウント確認のため、以下のリンクをクリックしてください。念の為、以下のリンクに２４の期限切れを付けています。
              <br>
              この要求を置くた人物はあなたではありません場合は、このメールを無視してください。
              <br>
              <br>
              <a href=${process.env.PUBLIC_API_ENDPOINT}/users/email-verification/${newCode}/${locale}>クリックしなさい</a>
          </body>
        </html>`;
          break;
      }

      console.log(email);

      this.sendMail(email, ``, emailSubject, emailBody)
        .then(() => {
          console.log("Email sent");
        })
        .catch((err) => {
          console.log(err);
        });

      success = true;
    }

    return { success: success };
  }

  async verifyAccount(resetCode: string, locale: string) {
    const user = await this.userModel.findOne({ resetCode: resetCode }).exec();

    console.log("email verification");
    console.log(locale);

    if (Date.now() < user.resetTimer) {
      console.log("Verification successful");
      let emailSubject = "";
      let emailBody = "";

      switch (locale) {
        case "pt":
          emailSubject = "Kyoka: Verificação de conta";
          emailBody = `
          <html>
            <body>
              Sua conta foi verificada com sucesso! Obrigado pelo seu cadastro.
            </body>
        </html>`;
          break;

        case "en":
          emailSubject = "Kyoka: Account verification";
          emailBody = `
          <html>
            <body>
              Your account has been verified successfully! Thank you for registering.
            </body>
        </html>`;
          break;
        case "ja":
          emailSubject = "Kyoka: アカウント確認";
          emailBody = `
            <html>
              <body>
               アカウントは正常に確認されました。登録よろしくお願いします。
              </body>
          </html>`;
          break;
      }

      this.sendMail(user.email, ``, emailSubject, emailBody);

      return this.update(user._id, {
        resetTimer: Date.now(),
        resetCode: uuidv4(),
        isVerified: true,
      });
    } else {
      console.log("Expired");
    }
  }

  async forgot(email: any, locale: any) {
    const user = await this.userModel.findOne({ email: email }).exec();
    let success = false;

    console.log("forgot");
    console.log(locale);

    if (user) {
      const newCode = uuidv4();
      const newResetTimer = Date.now() + 298999; //5 minutes in milliseconds

      await this.enableReset(user._id, newResetTimer, newCode);

      let emailSubject = "";
      let emailBody = "";

      switch (locale) {
        case "pt":
          emailSubject = "Kyoka: Redefinição de senha";
          emailBody = `
          <html>
            <body>
              Uma solicitação de redefinição de senha foi feita com o seu e-mail, clique no link abaixo 
              para redefinir sua senha. O link fornecido expirará em 5 minutos.
              <br>
              Caso você não tenha feito esta solicitação, por favor, 
              ignore esta mensagem.
              <br>
              <br>
              <a href=${process.env.PUBLIC_API_ENDPOINT}/users/${newCode}/${locale}>Clique aqui</a>
            </body>
          </html>`;
          break;

        case "en":
          emailSubject = "Kyoka: Password reset";
          emailBody = `
          <html>
            <body>
              A password reset request was made with your email, click the link below to reset your password. 
              The provided link will expire in 5 minutes.
              <br>
              If you haven't made this request, please ignore this message.
              <br>
              <br>
              <a href=${process.env.PUBLIC_API_ENDPOINT}/users/${newCode}/${locale}>Click here</a>
            </body>
          </html>`;
          break;
        case "ja":
          emailSubject = "Kyoka: パスワードリセット";
          emailBody = `
            <html>
              <body>
                このメールアドレスでパスワードリセット要求を送られました。以下のリンクをクリックするとパスワードをリセットされます。
                以下のリンクは5分の期限切れを付けています。
                <br>
                この要求を置くりました方はあなたではありません場合は、このメールを無視してください。
                <br>
                <br>
                <a href=${process.env.PUBLIC_API_ENDPOINT}/users/${newCode}/${locale}>クリックしなさい</a>
              </body>
            </html>`;
          break;
      }

      this.sendMail(user.email, ``, emailSubject, emailBody);

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
