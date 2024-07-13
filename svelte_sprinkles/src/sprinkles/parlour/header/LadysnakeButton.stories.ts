import type {Meta} from "@storybook/svelte";
import LadysnakeButton from "./LadysnakeButton.svelte";

export default {
  component: LadysnakeButton,
  tags: ['autodocs'],
  args: {
    href: '#',
  }
} satisfies Meta<LadysnakeButton>;

export const Default = {}
