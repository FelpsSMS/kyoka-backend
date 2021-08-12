import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { Card, CardDocument } from "./entities/card.entity";

@Injectable()
export class CardsService {
  constructor(
    private cloudinary: CloudinaryService,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
  ) {}

  async uploadAudioToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadAudio(file).catch(() => {
      throw new BadRequestException("Error.");
    });
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException("Invalid file type.");
    });
  }

  async create(
    createCardDto: CreateCardDto,
    files: Array<Express.Multer.File>,
  ) {
    const card = new this.cardModel(createCardDto);

    const imageFiles = files["images"];
    const sentenceAudioFiles = files["sentence_audio"];
    const focusAudioFiles = files["focus_audio"];

    let imageUrls: string[] = [];
    let sentenceAudioUrls: string[] = [];
    let focusAudioUrls: string[] = [];

    if (imageFiles) {
      await Promise.all(
        imageFiles.map(async (image) => {
          const imageUrl = await this.uploadImageToCloudinary(image).then(
            (res) => {
              return res.url;
            },
          );

          imageUrls = [...imageUrls, imageUrl];
          card.images = imageUrls;
        }),
      );
    }

    if (sentenceAudioFiles) {
      await Promise.all(
        sentenceAudioFiles.map(async (audio) => {
          const sentenceAudioUrl = await this.uploadAudioToCloudinary(
            audio,
          ).then((res) => {
            return res.url;
          });

          sentenceAudioUrls = [...sentenceAudioUrls, sentenceAudioUrl];

          card.sentenceAudio = sentenceAudioUrls;
        }),
      );
    }

    if (focusAudioFiles) {
      await Promise.all(
        focusAudioFiles.map(async (audio) => {
          const focusAudioUrl = await this.uploadAudioToCloudinary(audio).then(
            (res) => {
              return res.url;
            },
          );

          focusAudioUrls = [...focusAudioUrls, focusAudioUrl];

          card.focusAudio = focusAudioUrls;
        }),
      );
    }
    card.save();
  }

  getCardsByDeckId(deckId: string) {
    return this.cardModel.find({ deck: deckId });
  }

  findAll() {
    return `This action returns all cards`;
  }

  findOne(id: string) {
    return this.cardModel.findById(id);
  }

  async update(id: string, updateCardDto: UpdateCardDto, files) {
    const imageStrings = updateCardDto.imageStrings;
    const imageFiles = files["images"];
    const sentenceAudioFiles = files["sentence_audio"];
    const focusAudioFiles = files["focus_audio"];

    let imageUrls: string[] = [];
    let sentenceAudioUrls: string[] = [];
    let focusAudioUrls: string[] = [];

    if (imageFiles) {
      await Promise.all(
        imageFiles.map(async (image) => {
          const imageUrl = await this.uploadImageToCloudinary(image).then(
            (res) => {
              return res.url;
            },
          );

          imageUrls = [...imageUrls, imageUrl];
          updateCardDto.images = imageUrls;
        }),
      );
    }

    if (imageStrings) {
      imageStrings.map((imageUrl) => {
        imageUrls = [...imageUrls, imageUrl];
        updateCardDto.images = imageUrls;
      });
    }

    if (sentenceAudioFiles) {
      await Promise.all(
        sentenceAudioFiles.map(async (audio) => {
          const sentenceAudioUrl = await this.uploadAudioToCloudinary(
            audio,
          ).then((res) => {
            return res.url;
          });

          sentenceAudioUrls = [...sentenceAudioUrls, sentenceAudioUrl];

          updateCardDto.sentenceAudio = sentenceAudioUrls;
        }),
      );
    }

    if (focusAudioFiles) {
      await Promise.all(
        focusAudioFiles.map(async (audio) => {
          const focusAudioUrl = await this.uploadAudioToCloudinary(audio).then(
            (res) => {
              return res.url;
            },
          );

          focusAudioUrls = [...focusAudioUrls, focusAudioUrl];

          updateCardDto.focusAudio = focusAudioUrls;
        }),
      );
    }
    console.log(updateCardDto);

    return this.cardModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateCardDto,
      },
      {
        new: true,
      },
    );
  }

  remove(id: string) {
    return this.cardModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}
