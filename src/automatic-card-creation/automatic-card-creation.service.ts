import { BadRequestException, Injectable } from "@nestjs/common";

import { createClient } from "pexels";

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

          const languageData = { ja: "jpn", pt: "por" };
          const language = body.language;

          let sentence = "";
          let translation = "";

          if (body.sentence.length > 0) {
            sentence = body.sentence;
          } else {
            const tatoebaResults = await axios
              .get(
                `https://dev.tatoeba.org/ja/api_v0/search?from=eng&query=${word}&to=${languageData[language]}`, //por = portuguese, jpn = japanese
              )
              .then((res) => {
                let translation = "";

                console.log("Before for 1");
                console.log(res.data.results[0]);
                console.log("Before for 2");

                res.data.results[0].translations;
                console.log("Before for 3");

                const translationResults = res.data.results[0].translations;

                if (translationResults.length > 0)
                  for (let i = 0; i < translationResults[0].length; i++) {
                    if (translationResults[0][i]) {
                      console.log(translationResults[0][i]);

                      translation = translationResults[0][i].text;
                      break;
                    }
                  }
                else {
                  translation = translationResults.text;
                }

                const sentence = res.data.results[0]
                  ? res.data.results[0].text
                  : "";

                return {
                  translatedSentence: translation,
                  sentence: sentence,
                };
              });

            if (tatoebaResults.sentence.length > 0) {
              sentence = tatoebaResults.sentence;

              translation = tatoebaResults.translatedSentence;
            } else {
              sentence = example;
            }
          }

          let t2sAudio = "";
          let formattedSentence = "";

          if (sentence.length > 0) {
            if (translation.length == 0) {
              const machineTranslationResult = await axios.post(
                "https://translate.argosopentech.com/translate", //machine translation api
                {
                  q: sentence,
                  target: language,
                  source: "en",
                },
              );

              translation = machineTranslationResult.data.translatedText;
            }

            formattedSentence = encodeURIComponent(sentence.replace("'", ""));

            t2sAudio = await axios
              .get(
                `http://api.voicerss.org/?key=${process.env.VOICERSS_API_KEY}&hl=en-us&c=MP3&f=16khz_16bit_stereo
              &b64=true&src=${formattedSentence}`,
              ) //text to speech api
              .then(async (res) => {
                const audio: any = await this.uploadBase64AudioToCloudinary(
                  res.data,
                );

                return audio.secure_url;
              });
          } else {
            sentence = word;
          }

          const pexelsClient = createClient(process.env.PEXELS_API_KEY);

          const images = await pexelsClient.photos.search({
            query: word,
            per_page: 4,
          });
          console.log("IMAGES");
          console.log(images);

          return {
            audio,
            word,
            definition,
            sentence,
            translation,
            t2sAudio,
            images,
          };
        }
      })
      .catch((err) => {
        console.log(err.response);

        return undefined;
      });

    return response;
  }
}
