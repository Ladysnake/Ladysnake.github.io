<script lang="ts">
  import DialogueGlobalProperties from "./DialogueGlobalProperties.svelte";
  import DialogueStateList from "./DialogueStateList.svelte";
  import DialogueStateView from "./state/DialogueStateView.svelte";
  import {dialogueStart} from "../dialogueDataStore";
  import {type ComponentType, onMount} from "svelte";
  import Footer from "../Footer.svelte";

  let selectedState: string | undefined = $dialogueStart;
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
      <svelte:component this={GraphView}/>
    {/await}
  {/if}
  <Footer bind:mainView/>
</div>

<style>

</style>