import type {Meta} from "@storybook/svelte";
import ParlourHeader from "./ParlourHeader.svelte";
import {writable} from "svelte/store";

export default {
  component: ParlourHeader,
  tags: ['autodocs'],
} satisfies Meta<ParlourHeader>;

export const Default = {}
export const WithFilename = {
  args: {
    dialogueFilename: writable('my_dialogue'),
  }
}
