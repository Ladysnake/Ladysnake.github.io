<script lang="ts">
  import {dialogueData, dialogueStart, dialogueStateKeys} from "../dialogueDataStore.js";
  import NewDialogueState from "./NewDialogueState.svelte";
  import DeleteStateDialog from "./DeleteStateDialog.svelte";

  export let selectedState: string | undefined = undefined;
  let deleteDialog: DeleteStateDialog;

  function selectState(state: string) {
    console.log('Selecting state', state);
    selectedState = state;
    window.history.replaceState(window.history.state, '', `#${state}`);
  }

  async function deleteState(state: string) {
    const references = $dialogueData.findReferences(state);
    if ((!references.length && (state !== $dialogueStart || Object.keys($dialogueData.states).length === 1)) || await deleteDialog.confirm(state, references)) {
      selectedState = $dialogueStart;
      // The actual deletion should not reuse the references, in case the choices changed somehow
      $dialogueData = $dialogueData.withoutState(state);
    }
  }
</script>

<div class="toc-pane">
  <h3>Dialogue States</h3>
  <nav class="toc">
    <ul id="dialogue-state-list" class="toc-list">
      {#each $dialogueStateKeys as state}
        <li class="toc-item" data-state={state} class:toc-highlighted-link={selectedState === state}>
          <a class="toc-link" href="#{state}" title="View state '{state}'"
             on:click|preventDefault={() => selectState(state)}>{state}</a>
          <button class="btn btn-xs btn-danger delete" title="Delete state '{state}'"
                  on:click|preventDefault={async () => deleteState(state)}>
            <svg inline-src="octicon-trashcan"/>
          </button>
        </li>
      {/each}
    </ul>
  </nav>
  <DeleteStateDialog bind:this={deleteDialog}/>
  <NewDialogueState/>
</div>

<style>
  #dialogue-state-list {
    padding-bottom: 2.5rem;
    margin-right: 2px;
  }

  .toc-pane {
    display: flex;
    flex-direction: column;
  }

  .toc {
    width: 97.5%;
  }

  .toc-item {
    display: flex;
    gap: 2px;
  }

  .toc-item:hover {
    background-color: var(--accent-background-color);
  }

  .toc a {
    margin-left: 2px;
  }

  .delete {
    visibility: collapse;
    padding: 0 0.5em;
    cursor: pointer;
  }

  li:hover .delete, .toc-link:focus-visible + .delete, li:focus-within a:not(:focus) + .delete {
    visibility: visible;
  }

  .delete svg {
    height: 16px;
    width: auto;
  }
</style>
