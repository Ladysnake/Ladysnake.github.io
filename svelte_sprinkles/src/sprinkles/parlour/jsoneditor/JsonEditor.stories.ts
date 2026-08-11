import type {Meta} from "@storybook/svelte";
import JsonEditor from "./JsonEditor.svelte";
import {KnownSchemas} from "./schemaValidation";

export default {
  component: JsonEditor,
  tags: ['autodocs']
} satisfies Meta<JsonEditor>;

export const Default = {
  args: {
    schemaKey: KnownSchemas.DIALOGUE,
    json: {
      states: {}
    }
  }
}
