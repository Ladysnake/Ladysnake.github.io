<script lang="ts">
  import {dialogueStateKeys} from "../dialogueDataStore.js";
  import NewDialogueState from "./NewDialogueState.svelte";

  export let selectedState: string | undefined = undefined;

  function selectState(state: string) {
    selectedState = state;
    window.history.replaceState(window.history.state, '', `#${state}`);
  }
</script>

<div class="toc-pane">
  <h3>Dialogue States</h3>
  <nav class="toc">
    <ul id="dialogue-state-list">
      {#each $dialogueStateKeys as state}
        <li data-state={state} class:toc-highlighted-link={selectedState === state}>
          <a href="#{state}" on:click|preventDefault={() => selectState(state)}>{state}</a>
        </li>
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