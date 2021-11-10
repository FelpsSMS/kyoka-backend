import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { Session, SessionDocument } from "./entities/session.entity";

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  create(createSessionDto: CreateSessionDto) {
    const session = new this.sessionModel(createSessionDto);

    return session.save();
  }

  async getLastSession(body: any) {
    const userSessions = await this.sessionModel
      .find({ user: body.userId })
      .exec();

    if (userSessions.length > 0) {
      const lastSession = userSessions.reduce((a, b): any => {
        return Math.max(a.endTime, b.endTime);
      });

      return lastSession;
    }

    return false;
  }

  async getSessionsByUser(body: any) {
    const userSessions = await this.sessionModel
      .find({ user: body.userId })
      .exec();

    return userSessions;
  }

  getDecksByUser(body: any) {
    return this.sessionModel.find({ user: body.userId });
  }

  async getSRSStats(body: any) {
    const statsByDeckId: any = await this.sessionModel
      .find({ deck: body.deckId })
      .exec();

    const statsByDeckIdAndUserId: any = statsByDeckId.filter(
      (item) => item.user == body.userId,
    );

    return statsByDeckIdAndUserId[0];
  }

  async authenticateDeletion(body: any) {
    const statsByDeckId: any = await this.sessionModel
      .find({ deck: body.deckId })
      .exec();

    const statsByDeckIdAndUserId: any = statsByDeckId.filter(
      (item) => item.user == body.userId,
    );

    let deleteAuth = false;

    if (!statsByDeckIdAndUserId[0].readOnly) {
      deleteAuth = true;
    }

    return deleteAuth;
  }

  async deleteStatsByDeckAndUser(body: any) {
    const statsByDeckId: any = await this.sessionModel
      .find({ deck: body.deckId })
      .exec();

    const statsByDeckIdAndUserId: any = statsByDeckId.filter(
      (item) => item.user == body.userId,
    );

    let deleteAuth = false;

    await this.remove(statsByDeckIdAndUserId[0]._id);

    if (!statsByDeckIdAndUserId[0].readOnly) {
      deleteAuth = true;
    }

    return deleteAuth;
  }

  findAll() {
    return `This action returns all sessions`;
  }

  findOne(id: string) {
    return this.sessionModel.findById(id);
  }

  update(id: string, updateSessionDto: UpdateSessionDto) {
    return this.sessionModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateSessionDto,
      },
      {
        new: true,
      },
    );
  }

  remove(id: string) {
    return this.sessionModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}
