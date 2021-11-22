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
              return res.secure_url;
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
              return res.secure_url;
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

          cardStructure[image.originalname.slice(0, -1)].push({
            url: image.url,
          });
        }
      });
    }

    console.log(cardStructure);

    card.layoutInfo.push(cardStructure);

    card.save();

    return card;
  }

  createWithoutFiles(body: any) {
    const card = new this.cardModel(body);

    card.creator = body.user;
    card.deck = body.deck;
    const images = [];
    const layoutInfo = {};

    console.log(body.images);

    for (let i = 0; i < body.images.photos.length; i++) {
      images.push({
        url: body.images.photos[i].src.landscape,
        photographer: body.images.photos[i].photographer,
        siteUrl: body.images.photos[i].url,
        photographerUrl: body.images.photos[i].photographer_url,
      });
    }

    console.log(images);

    layoutInfo["images"] = images;
    layoutInfo["focus"] = body.focus;
    layoutInfo["bilingualDescription"] = body.bilingualDescription;
    layoutInfo["monolingualDescription"] = body.monolingualDescription;
    layoutInfo["sentence"] = body.sentence;
    layoutInfo["translation"] = body.translation;
    layoutInfo["sentenceAudio"] = body.sentenceAudio;
    layoutInfo["focusAudio"] = body.focusAudio;

    card.layoutInfo.push(layoutInfo);

    card.save();

    return card;
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

  async update(id: string, body: any, files) {
    const cardStructure = {};

    Object.entries(body).map((item) => {
      const lastChar = item[0].slice(-1);
      const isNotNumber = isNaN(parseInt(lastChar));

      if (isNotNumber) {
        cardStructure[item[0]] = item[1];
      } else {
        if (!cardStructure[item[0].slice(0, -1)]) {
          cardStructure[item[0].slice(0, -1)] = [];
        }

        cardStructure[item[0].slice(0, -1)].push({ url: item[1] });
      }
    });

    let uploadedImages = [];
    let uploadedAudios = [];

    if (files["audios"]) {
      uploadedAudios = await Promise.all(
        files["audios"].map(async (audio) => {
          const audioUrl = await this.uploadAudioToCloudinary(audio).then(
            (res) => {
              return res.secure_url;
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
              return res.secure_url;
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

          cardStructure[image.originalname.slice(0, -1)].push({
            url: image.url,
          });
        }
      });
    }

    const info = [];

    info.push(cardStructure);
    const updateBody = { layoutInfo: info };

    console.log(updateBody);

    return this.cardModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateBody,
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
