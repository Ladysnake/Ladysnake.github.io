import {McTextType} from "../../lib/McText";

export const EDITOR_TEXT_FORMAT_KEY = 'blabber-editor-text-format';

export function getSavedTextFormat() {
  const savedTextFormat = localStorage.getItem(EDITOR_TEXT_FORMAT_KEY);
  return Object.values(McTextType).includes(savedTextFormat as McTextType) ? savedTextFormat as McTextType : null;
}
