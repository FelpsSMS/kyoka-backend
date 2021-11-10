import { Module } from "@nestjs/common";

import { MongooseModule } from "@nestjs/mongoose";
import { SessionSchema } from "./entities/session.entity";

import { Session } from "inspector";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
