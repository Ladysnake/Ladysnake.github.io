// https://github.com/Microsoft/TypeScript/wiki/FAQ#can-i-make-a-type-alias-nominal
export type Identifier = string & {'this is an identifier': {}};

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
