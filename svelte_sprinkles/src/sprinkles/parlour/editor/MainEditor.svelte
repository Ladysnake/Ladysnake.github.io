<script lang="ts">
  import DialogueGlobalProperties from "./DialogueGlobalProperties.svelte";
  import DialogueStateList from "./DialogueStateList.svelte";
  import DialogueStateView from "./state/DialogueStateView.svelte";
  import {dialogueStart} from "../dialogueDataStore";

  let selectedState: string | undefined = $dialogueStart;
</script>

<div id="dialogue-editor">
  <DialogueGlobalProperties/>
  <div class="wiki-container">
    <DialogueStateList bind:selectedState/>
    {#if selectedState}
      <DialogueStateView state={selectedState}/>
    {/if}
  </div>
</div>

<style>

</style>