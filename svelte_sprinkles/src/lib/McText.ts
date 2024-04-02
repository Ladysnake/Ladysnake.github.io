export type Identifier = string;

export interface McTextRaw {
  readonly value: string | object;
}

export interface McTextTranslatable {
  readonly translate?: string;
}

export type McText = string | McTextTranslatable | McTextRaw;

export enum McTextType {
  PLAIN = 'plain',
  TRANSLATION_KEY = 'translation_key',
  JSON = 'json',
}
