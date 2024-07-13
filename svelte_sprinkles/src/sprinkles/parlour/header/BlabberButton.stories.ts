import type {Meta} from "@storybook/svelte";
import BlabberButton from "./BlabberButton.svelte";

export default {
  component: BlabberButton,
  tags: ['autodocs'],
  args: {
    href: '#',
  }
} satisfies Meta<BlabberButton>;

export const Default = {}
