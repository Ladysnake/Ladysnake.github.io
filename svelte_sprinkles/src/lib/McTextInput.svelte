<script lang="ts">
  import {type McText, type McTextTranslatable, McTextType} from "./McText";
  import { createEventDispatcher } from 'svelte';
  import type {Action} from "svelte/action";

  const dispatch = createEventDispatcher<{
    'change': McText,
  }>();

  export let id: string | undefined = undefined;
  let className: string | undefined = undefined;
  // noinspection ReservedWordAsName
  export { className as class };
  export let placeholder: string | undefined = undefined;
  export let value: McText = '';
  export let textFormat: McTextType = McTextType.PLAIN;
  export let action: Action<HTMLInputElement> = () => {};

  function importDialogueText(text: McText): string {
    if (!text) return '';
    switch (textFormat) {
      case McTextType.PLAIN: return `${text}`;
      case McTextType.TRANSLATION_KEY: return (text as McTextTranslatable).translate ?? '';
      case McTextType.JSON: return JSON.stringify(text);
    }
  }

  function exportDialogueText(text: string): McText {
    switch (textFormat) {
      case McTextType.PLAIN: return text;
      case McTextType.TRANSLATION_KEY: return {translate: text};
      case McTextType.JSON: return JSON.parse(text);
    }
  }
</script>
<input
  type="text"
  class={className}
  id={id}
  placeholder={placeholder}
  value={importDialogueText(value)}
  on:change={(e) => {
    value = exportDialogueText(e.currentTarget.value);
    dispatch('change', value);
  }}
  use:action
/>
