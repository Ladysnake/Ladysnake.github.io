import {McTextType} from "../../lib/McText";

export const EDITOR_TEXT_FORMAT_KEY = 'blabber-editor-text-format';

export function loadChosenTextFormat() {
  return tryCastTextFormat(localStorage.getItem(EDITOR_TEXT_FORMAT_KEY));
}

export function tryCastTextFormat(value: string | null) {
  return Object.values(McTextType).includes(value as McTextType) ? value as McTextType : null;
}