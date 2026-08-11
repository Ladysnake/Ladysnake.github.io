import type {Meta} from "@storybook/svelte";
import McTextInput from "./McTextInput.svelte";
import {McTextType} from "./McText";

export default {
  component: McTextInput,
  tags: ['autodocs'],
  args: {
    id: undefined,
    inputClass: undefined,
    containerClass: undefined,
    placeholders: {
      json: 'JSON',
      plain: 'PLAIN',
      translation_key: 'TRANSLATION KEY'
    },
    value: '',
    textFormat: McTextType.PLAIN,
  },
  argTypes: {
    id: {
      type: 'string'
    },
    textFormat: {
      options: Object.keys(McTextType),
    }
  }
} satisfies Meta<McTextInput>;

export const Plain = {}
export const TranslationKey = {
  args: {
    textFormat: McTextType.TRANSLATION_KEY,
  }
}
export const Json = {
  args: {
    textFormat: McTextType.JSON,
  }
}
