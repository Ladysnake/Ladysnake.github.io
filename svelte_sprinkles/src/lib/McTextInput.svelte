<script lang="ts">
  import {type McText, type McTextTranslatable, McTextType} from "./McText";
  import {createEventDispatcher} from 'svelte';
  import type {Action} from "svelte/action";
  import {dialogueTextFormat} from "../sprinkles/parlour/dialogueDataStore";
  import ResizingInput from "./ResizingInput.svelte";

  const dispatch = createEventDispatcher<{
    'change': McText,
  }>();

  export let id: string | undefined = undefined;
  let className: string | undefined = undefined;
  // noinspection ReservedWordAsName
  export {className as class};
  export let placeholders: Record<McTextType, string> | undefined = undefined;
  export let value: McText = '';
  export let textFormat: McTextType = $dialogueTextFormat;
  export let action: Action<HTMLTextAreaElement | HTMLInputElement> = () => {};

  $: placeholder = placeholders?.[textFormat];

  function importDialogueText(text: McText): string {
    if (!text) return '';
    switch (textFormat) {
      case McTextType.PLAIN:
        return `${text}`;
      case McTextType.TRANSLATION_KEY:
        return (text as McTextTranslatable).translate ?? '';
      case McTextType.JSON:
        return JSON.stringify(text);
    }
  }

  function exportDialogueText(text: string): McText {
    switch (textFormat) {
      case McTextType.PLAIN:
        return text;
      case McTextType.TRANSLATION_KEY:
        return { translate: text };
      case McTextType.JSON:
        return JSON.parse(text);
    }
  }

  function onChange(e: Event) {
    const currentTarget = e.currentTarget as HTMLInputElement | HTMLTextAreaElement;
    value = exportDialogueText(currentTarget.value);
    dispatch('change', value);
  }
</script>
<ResizingInput
  class={className}
  id={id}
  placeholder={placeholder}
  value={importDialogueText(value)}
  maxRows={textFormat === McTextType.TRANSLATION_KEY ? 1 : undefined}
  on:change={onChange}
  action={action}
/>
