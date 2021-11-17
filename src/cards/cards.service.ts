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

  async create(body: any, files: Array<Express.Multer.File>) {
    const card = new this.cardModel(body);
    const cardStructure = {};

    Object.entries(body).map((item) => {
      cardStructure[item[0]] = item[1];
    });

    let uploadedImages = [];
    let uploadedAudios = [];

    if (files["audios"]) {
      uploadedAudios = await Promise.all(
        files["audios"].map(async (audio) => {
          const audioUrl = await this.uploadAudioToCloudinary(audio).then(
            (res) => {
              return res.url;
            },
          );

          return { url: audioUrl, originalname: audio.originalname };
        }),
      );

      uploadedAudios.map((audio: any) => {
        const lastChar = audio.originalname.slice(-1);
        const isNotNumber = isNaN(parseInt(lastChar));

        if (isNotNumber) {
          cardStructure[audio.originalname] = audio.url;
        } else {
          if (!cardStructure[audio.originalname.slice(0, -1)]) {
            cardStructure[audio.originalname.slice(0, -1)] = [];
          }

          cardStructure[audio.originalname.slice(0, -1)].push(audio.url);
        }
      });
    }

    if (files["images"]) {
      uploadedImages = await Promise.all(
        files["images"].map(async (image) => {
          const imageUrl = await this.uploadImageToCloudinary(image).then(
            (res) => {
              return res.url;
            },
          );

          return { url: imageUrl, originalname: image.originalname };
        }),
      );

      uploadedImages.map((image: any) => {
        const lastChar = image.originalname.slice(-1);
        const isNotNumber = isNaN(parseInt(lastChar));

        if (isNotNumber) {
          cardStructure[image.originalname] = image.url;
        } else {
          if (!cardStructure[image.originalname.slice(0, -1)]) {
            cardStructure[image.originalname.slice(0, -1)] = [];
          }

          cardStructure[image.originalname.slice(0, -1)].push(image.url);
        }
      });
    }

    console.log(cardStructure);

    card.layoutInfo.push(cardStructure);

    card.save();

    return card;
  }

  createWithoutFiles(body: any) {
    /* const card = new this.cardModel();

    card.focus = body.focus;
    card.bilingualDescription = body.bilingualDescription;
    card.monolingualDescription = body.monolingualDescription;
    card.sentence = body.sentence;
    card.translation = body.translation;
    card.sentenceAudio[0] = body.sentenceAudio;
    card.focusAudio[0] = body.focusAudio;
    card.deck = body.deck;
    card.creator = body.user;

    if (body.images) {
      const maxImages = 4;

      for (let i = 0; i < maxImages; i++) {
        card.images[i] = {
          url: body.images.photos[i].src.landscape,
          photographer: body.images.photos[i].photographer,
          siteUrl: body.images.photos[i].url,
          photographerUrl: body.images.photos[i].photographer_url,
        };
      }
    }

    console.log(card);

    card.save();

    return card; */
  }

  async authenticateDeletion(body: any) {
    const card: any = await this.cardModel.findById(body.id).exec();

    if (card.creator == body.creator) {
      return this.remove(body.id);
    } else {
      const message = "Deletion failed: User not authorized";

      return message;
    }
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

    let uploadedImages: any = [];
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

          uploadedImages = [...uploadedImages, { url: imageUrl }];
          updateCardDto.images = uploadedImages;
        }),
      );
    }

    if (imageStrings) {
      imageStrings.map((imageUrl) => {
        uploadedImages = [...uploadedImages, imageUrl];
        updateCardDto.images = uploadedImages;
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
