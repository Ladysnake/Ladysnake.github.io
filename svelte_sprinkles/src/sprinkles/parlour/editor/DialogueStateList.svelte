<script lang="ts">
  import {dialogueData, dialogueStart, dialogueStateKeys} from "../dialogueDataStore.js";
  import NewDialogueState from "./NewDialogueState.svelte";
  import DeleteStateDialog from "./DeleteStateDialog.svelte";
  import RenameStateDialog from "./RenameStateDialog.svelte";

  export let selectedState: string | undefined = undefined;
  let renameDialog: RenameStateDialog;
  let deleteDialog: DeleteStateDialog;

  function selectState(state: string) {
    selectedState = state;
    window.history.replaceState(window.history.state, '', `#${state}`);
  }

  async function deleteState(state: string) {
    const references = $dialogueData.findReferences(state);
    if ((!references.length && (state !== $dialogueStart || Object.keys($dialogueData.states).length === 1)) || await deleteDialog.confirm(state, references)) {
      selectedState = $dialogueStart;
      // The actual deletion should not reuse the references, in case the choices changed somehow
      $dialogueData = $dialogueData.withoutState(state);
      return true;
    }
    return false;
  }

  async function onKeypress(event: KeyboardEvent, state: string) {
    console.log(event);
    if (event.key === "Backspace" || event.key === "Delete") {
      await deleteState(state);
    }
  }
</script>

<div class="toc-pane">
  <h3>Dialogue States</h3>
  <nav class="toc">
    <ul id="dialogue-state-list" class="toc-list">
      {#each $dialogueStateKeys as state}
        <li class="toc-item" data-state={state} class:toc-highlighted-link={selectedState === state}>
          <a
            class="toc-link"
            href="#{state}"
            title="View state '{state}'"
            tabindex="0"
            on:click|preventDefault={() => selectState(state)}
            on:keydown={(e) => onKeypress(e, state)}
          >
            {state}
          </a>
          <button class="btn btn-xs btn-info edit" title="Rename or delete state '{state}'"
                  on:click|preventDefault={() => renameDialog.show(state, state === selectedState)}>
            <svg inline-src="octicon-pencil-16"/>
          </button>
        </li>
      {/each}
    </ul>
  </nav>
  <DeleteStateDialog bind:this={deleteDialog}/>
  <RenameStateDialog selectState={selectState} deleteState={deleteState} bind:this={renameDialog}/>
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

  .edit {
    visibility: collapse;
    padding: 0 0.5em;
    cursor: pointer;
  }

  li:hover .edit, .toc-link:focus-visible + .edit, li:focus-within a:not(:focus) + .edit {
    visibility: visible;
  }

  .edit svg {
    height: 16px;
    width: auto;
  }
</style>
