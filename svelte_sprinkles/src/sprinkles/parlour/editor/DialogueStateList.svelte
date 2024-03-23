<script lang="ts">
  import {dialogueStateKeys} from "../dialogueDataStore.js";
  import NewDialogueState from "./NewDialogueState.svelte";

  export let selectedState: string | undefined = undefined;
</script>

<div class="toc-pane">
  <h3>Dialogue States</h3>
  <nav class="toc">
    <ul id="dialogue-state-list">
      {#each $dialogueStateKeys as state}
        <li data-state={state}><a href="#{state}" on:click={() => selectedState = state}>{state}</a></li>
      {/each}
    </ul>
    <NewDialogueState/>
  </nav>
</div>

<style>
  #dialogue-state-list {
    padding-bottom: 2.5rem;
  }
</style>