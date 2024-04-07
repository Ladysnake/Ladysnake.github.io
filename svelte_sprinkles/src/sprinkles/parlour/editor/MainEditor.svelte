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

  $: {
    if (!(selectedState && selectedState in $dialogueData.states)) {
      selectedState = $dialogueStart;
    }
  }

  let mainView = true;

  let GraphView: Promise<ComponentType>;

  onMount(() => {
    GraphView = import('../graph/DialogueGraphView.svelte').then(m => m.default)
  });
</script>

{#if mainView}
  <DialogueGlobalProperties/>
  <div class="wiki-container">
    <DialogueStateList bind:selectedState/>
    {#if selectedState && $dialogueData.states[selectedState]}
      <DialogueStateView selectedState={selectedState}/>
    {/if}
  </div>
{:else}
  {#await GraphView then GraphView}
    <svelte:component this={GraphView} on:select={(e) => {
      mainView = true;
      selectedState = e.detail;
    }}/>
  {/await}
{/if}
<Footer bind:mainView on:load={(e) => selectedState = e.detail.startAt}/>

<style>
:global(#dialogue-import-export) {
  position: absolute;
  width: 100%;
  bottom: 0;
}
</style>
