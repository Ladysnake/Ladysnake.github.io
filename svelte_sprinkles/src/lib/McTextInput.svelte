<script lang="ts">
  import {type McText, type McTextTranslatable, McTextType} from "./McText";
  import {createEventDispatcher} from 'svelte';
  import type {Action} from "svelte/action";
  import {dialogueTextFormat} from "../sprinkles/parlour/dialogueDataStore";
  import ResizingInput from "./ResizingInput.svelte";
  import JsonEditor from "../sprinkles/parlour/jsoneditor/JsonEditor.svelte";
  import {KnownSchemas} from "../sprinkles/parlour/jsoneditor/schemaValidation.js";
  import McTextRenderer from "./McTextRenderer.svelte";
  import classNames from "classnames";

  const dispatch = createEventDispatcher<{
    'change': McText,
  }>();

  export let id: string | undefined = undefined;
  export let inputClass: string | undefined = undefined;
  export let containerClass: string | undefined = undefined;
  export let placeholders: Record<McTextType, string> | undefined = undefined;
  export let value: McText = '';
  export let textFormat: McTextType = $dialogueTextFormat;
  export let action: Action<HTMLTextAreaElement | HTMLInputElement> = () => {
  };
  let jsonEditorDialog: HTMLDialogElement;

  $: placeholder = placeholders?.[textFormat];
  $: fullInputClass = classNames(inputClass, 'mc-text-input', textFormat === McTextType.TRANSLATION_KEY && 'translatable-mc-text');

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

<div class="mc-text">
  {#if textFormat === McTextType.JSON}
    <McTextRenderer class="mc-text-input" text={value}/>
  {:else}
    <ResizingInput
      containerClass={containerClass}
      inputClass={fullInputClass}
      id={id}
      placeholder={placeholder}
      value={importDialogueText(value)}
      maxRows={textFormat === McTextType.TRANSLATION_KEY ? 1 : undefined}
      on:change={onChange}
      action={action}
    />
  {/if}
  <button class="json-btn" on:click={() => jsonEditorDialog.showModal()}><svg inline-src="code-json"/></button>
  <dialog bind:this={jsonEditorDialog}>
    <div id="raw-text-tip">See also <a href="https://minecraft.tools/en/json_text.php">
      Minecraft Tools' Text Generator <svg inline-src="external-link"/></a>
    </div>
    <JsonEditor bind:json={value} schemaKey={KnownSchemas.TEXT_COMPONENT}/>
    <button class="btn btn-sm btn-info" on:click={() => jsonEditorDialog.close()}>Close</button>
  </dialog>
</div>

<style>
  .mc-text {
    display: flex;
    width: 100%;
  }

  .mc-text :global(.mc-text-input) {
    border-radius: 0.4em 0 0 0.4em;
    border: 1px solid var(--button-outline);
    flex: auto;
  }

  .mc-text :global(.translatable-mc-text)::before {
    content: '<svg width="24px" height="24px" viewBox="0 0 24 24"><path fill="currentColor" d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z" /></svg>'
  }

  .json-btn {
    border-radius: 0 0.4em 0.4em 0;
    border: 1px solid var(--button-outline);
    border-left-width: 0;
    background-color: transparent;
    cursor: pointer;
  }

  svg {
    vertical-align: middle;
  }
</style>
