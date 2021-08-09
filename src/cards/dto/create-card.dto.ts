export class CreateCardDto {
  sentence: string;
  focus: string;
  bilingualDescription: string;
  monolingualDescription: string;
  sentenceAudio: string[];
  focusAudio: string[];
  translation: string;
  notes: string;
  images: string[];
  deck: string;
  dateAdded: Date;
  dateDue: Date;
  lapses: number;
}
