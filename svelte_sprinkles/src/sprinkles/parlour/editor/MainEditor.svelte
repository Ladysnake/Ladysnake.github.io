<script lang="ts">
  import DialogueGlobalProperties from "./DialogueGlobalProperties.svelte";
  import DialogueStateList from "./DialogueStateList.svelte";
  import DialogueStateView from "./state/DialogueStateView.svelte";
  import {dialogueData, dialogueStart, dialogueStateKeys} from "../dialogueDataStore";
  import {type ComponentType, onMount} from "svelte";
  import Footer from "../Footer.svelte";

  function loadSelectedState() {
    const hash = decodeURIComponent(window.location.hash);
    if (hash.length) {
      const state = hash.substring(1);
      if (state in $dialogueData.states) {
        return state;
      }
    }
    return null;
  }

  let selectedState: string | undefined = loadSelectedState() ?? $dialogueStart;
  let mainView = true;

  let GraphView: Promise<ComponentType>;

  onMount(() => {
    GraphView = import('../graph/DialogueGraphView.svelte').then(m => m.default)
  });
</script>

<div id="dialogue-editor">
  {#if mainView}
    <DialogueGlobalProperties/>
    <div class="wiki-container">
      <DialogueStateList bind:selectedState/>
      {#if selectedState}
        <DialogueStateView selectedState={selectedState}/>
      {/if}
    </div>
  {:else}
    {#await GraphView then GraphView}
      <svelte:component this={GraphView} bind:selectedState bind:mainView/>
    {/await}
  {/if}
  <Footer bind:mainView on:load={(e) => selectedState = e.detail.startAt}/>
</div>

<style>
:global(#dialogue-import-export) {
  position: absolute;
  width: 100%;
  bottom: 0;
}
#dialogue-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>