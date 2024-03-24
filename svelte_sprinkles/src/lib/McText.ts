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

export function parseMcTextType(value: string) {
  switch (value) {
    case 'literal':
      return McTextType.PLAIN;
    case 'translate':
      return McTextType.TRANSLATION_KEY;
    case 'json':
      return McTextType.JSON;
    default:
      return McTextType.PLAIN;
  }
}
