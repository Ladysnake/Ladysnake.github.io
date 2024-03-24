<script lang="ts">
  import Landing from "./landing/Landing.svelte";
  import {dialogueData, dialogueFilename} from "./dialogueDataStore";
  import Footer from "./Footer.svelte";
  import MainEditor from "./editor/MainEditor.svelte";
  import BlabberDialogue from "./BlabberDialogue";

  export let mainView = true;

  function loadDraft() {
    const wipDialogue = window.history.state;
    if (wipDialogue) {
      $dialogueData = new BlabberDialogue(wipDialogue.data, wipDialogue.filename);
    }
  }

  loadDraft();
</script>

<svelte:window on:popstate={loadDraft}/>
<main>
  {#if (!$dialogueFilename)}
    <Landing/>
  {:else}
    {#if mainView}
      <MainEditor/>
    {:else}
      <p>{$dialogueFilename}</p>
      <button on:click={() => $dialogueFilename = undefined}>Reset</button>
    {/if}
    <Footer bind:mainView/>
  {/if}
</main>

<style>
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
