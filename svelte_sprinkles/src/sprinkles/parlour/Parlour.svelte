<script context="module" lang="ts">
  import 'vite/modulepreload-polyfill';
</script>
<script lang="ts">
  import Landing from "./landing/Landing.svelte";
  import {dialogueData, dialogueFilename} from "./dialogueDataStore";
  import BlabberDialogue from "./model/BlabberDialogue";
  import {type ComponentType, onMount} from "svelte";
  import {loadChosenTextFormat, tryCastTextFormat} from "./localStorageKeys";
  import {McTextType} from "../../lib/McText";
  import {dialogueTextFormat} from "./dialogueDataStore.js";
  import ParlourHeader from "./header/ParlourHeader.svelte";

  let MainEditor: Promise<ComponentType>;

  onMount(() => {
    MainEditor = import('./editor/MainEditor.svelte').then(m => m.default);
  });

  function loadDraft() {
    const wipDialogue = window.history.state;
    if (wipDialogue) {
      $dialogueData = new BlabberDialogue(wipDialogue.data, wipDialogue.filename);
      $dialogueTextFormat = tryCastTextFormat(window.history.state?.textFormat) ?? loadChosenTextFormat() ?? McTextType.PLAIN;
    }
  }

  loadDraft();
</script>

<svelte:window on:popstate={loadDraft}/>
<ParlourHeader/>
<main class="container">
  {#if (!$dialogueFilename)}
    <Landing/>
  {:else}
    {#await MainEditor then MainEditor}
      <svelte:component this={MainEditor}/>
    {/await}
  {/if}
</main>

<style>
  main {
    flex: auto;
    display: flex;
    flex-direction: column;
  }

  /* Artificially decrease specificity using where selectors */
  :where(main) :global(input:where([type=text])) {
    width: 99%;
    margin-left: 2px;
    border: 2px solid transparent;

    &:invalid {
      border-color: var(--color-invalid);
      color: var(--color-invalid);

      & + input[type=submit] {
        background-color: var(--color-invalid);
      }
    }
  }
</style>
