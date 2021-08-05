export class CreateCardDto {
  sentence: string;
  focus: string;
  bilingualDescription: string;
  monolingualDescription: string;
  sentenceAudio: Express.Multer.File;
  focusAudio: Express.Multer.File;
  translation: string;
  notes: string;
  images: Express.Multer.File[];
}
