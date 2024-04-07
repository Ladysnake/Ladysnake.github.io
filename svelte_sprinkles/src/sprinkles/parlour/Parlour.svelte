<script context="module" lang="ts">
  import 'vite/modulepreload-polyfill';
</script>
<script lang="ts">
  import Landing from "./landing/Landing.svelte";
  import {dialogueData, dialogueFilename} from "./dialogueDataStore";
  import BlabberDialogue from "./model/BlabberDialogue";
  import {type ComponentType, onMount} from "svelte";
  import DialogueFilenameInput from "./DialogueFilenameInput.svelte";

  let MainEditor: Promise<ComponentType>;

  onMount(() => {
    MainEditor = import('./editor/MainEditor.svelte').then(m => m.default);
  });

  function loadDraft() {
    const wipDialogue = window.history.state;
    if (wipDialogue) {
      $dialogueData = new BlabberDialogue(wipDialogue.data, wipDialogue.filename);
    }
  }

  loadDraft();
</script>

<svelte:window on:popstate={loadDraft}/>
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="/">Home</a></li>
    <li class="breadcrumb-item"><a href="/wiki/blabber">Blabber</a></li>
    <li class="breadcrumb-item active">Dialogue Editor</li>
    {#if $dialogueFilename}
      <li class="breadcrumb-item" aria-current="page">
        <DialogueFilenameInput bind:value={$dialogueFilename}/>.json
      </li>
    {/if}
  </ol>
</nav>
<main>
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
