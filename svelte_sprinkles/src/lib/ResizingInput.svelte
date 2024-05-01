<script lang="ts">
  import type {Action} from "svelte/action";

  export let value = '';
  export let minRows = 1;
  export let maxRows: number | undefined;
  export let id: string | undefined = undefined;
  export let placeholder: string | undefined = undefined;
  export let containerClass: string | undefined = undefined;
  export let inputClass: string | undefined = undefined;
  export let action: Action<HTMLTextAreaElement | HTMLInputElement> = () => {};

  $: minHeight = `${1 + minRows * 1.2}em`;
  $: maxHeight = maxRows ? `${1 + maxRows * 1.2}em` : `auto`;
</script>

<div class="textarea-container ${containerClass}">
  {#if maxRows === undefined || maxRows > 1}
    <div
      aria-hidden="true"
      class="textarea-mirror"
      style="min-height: {minHeight}; max-height: {maxHeight}"
    >{value + '\n'}</div>
    <textarea id={id} class={inputClass} placeholder={placeholder} bind:value on:change use:action></textarea>
  {:else}
    <input id={id} class={inputClass} placeholder={placeholder} bind:value on:change use:action/>
  {/if}
</div>

<style>
  .textarea-container {
    position: relative;
    width: 100%;
  }

  .textarea-mirror, textarea {
    font-family: inherit;
    padding: 0.5em;
    box-sizing: border-box;
    border: 1px solid var(--button-outline);
    line-height: 1.2;
    overflow: hidden;
  }

  .textarea-mirror {
    visibility: hidden;
    white-space: pre-wrap;
  }

  textarea {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    resize: none;
  }

  input {
    width: 100%;
  }
</style>
