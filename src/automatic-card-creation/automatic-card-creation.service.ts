import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

import axios from "axios";

@Injectable()
export class AutomaticCardCreationService {
  constructor(private cloudinary: CloudinaryService) {}

  async uploadBase64AudioToCloudinary(uri: string) {
    return await this.cloudinary.uploadAudioBase64(uri).catch(() => {
      throw new BadRequestException("Error.");
    });
  }

  async getAudio(body: any) {
    const response = await axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${body.focus}`)
      .then(async (res) => {
        if (res.data[0].phonetics[0].audio) {
          const audio = res.data[0].phonetics[0].audio;

          return audio;
        }
      })
      .catch((err) => {
        console.log(err);

        return undefined;
      });

    return response;
  }

  async generateCard(body: any) {
    const response = await axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${body.focus}`) //dictionary api
      .then(async (res) => {
        if (res.data) {
          const audio = res.data[0].phonetics[0].audio;
          const word = res.data[0].word;
          const definition = res.data[0].meanings[0].definitions[0].definition;
          const example = res.data[0].meanings[0].definitions[0].example;

          let sentence = "";

          if (body.sentence.length > 0) {
            sentence = body.sentence;
          } else {
            sentence = example;
          }

          const translation = await axios.post(
            "https://translate.argosopentech.com/translate", //machine translation api
            {
              q: sentence,
              source: "en",
              target: "pt",
            },
          );

          const formattedSentence = encodeURIComponent(
            sentence.replace("'", ""),
          );

          const t2sAudio = await axios
            .get(
              `http://api.voicerss.org/?key=${process.env.VOICERSS_API_KEY}&hl=en-us&c=MP3&f=16khz_16bit_stereo
              &b64=true&src=${formattedSentence}`,
            ) //text to speech api
            .then(async (res) => {
              const audio: any = await this.uploadBase64AudioToCloudinary(
                res.data,
              );

              return audio.url;
            });

          return {
            audio,
            word,
            definition,
            sentence,
            translation: translation.data.translatedText,
            t2sAudio,
          };
        }
      })
      .catch((err) => {
        console.log(err);

        return undefined;
      });

    return response;
  }
}
