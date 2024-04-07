<script lang="ts">
  import {dialogueData} from "../dialogueDataStore";

  export let selectState: (state: string) => void;
  export let deleteState: (state: string) => Promise<boolean>;

  let currentlySelected: boolean | undefined;
  let currentName: string | undefined;
  let dialog: HTMLDialogElement;
  let stateNameField: HTMLInputElement;
  let newName: string;

  export function show(state: string, selected: boolean) {
    currentName = state;
    newName = state;
    currentlySelected = selected;
    stateNameField?.setCustomValidity('');
    stateNameField?.reportValidity();
    dialog.showModal();
  }

  function validateNewName() {
    if (!stateNameField.value) {
      stateNameField.setCustomValidity('Please enter a valid non-namespaced identifier');
    } else if (stateNameField.validity.patternMismatch) {
      stateNameField.setCustomValidity('Must be a valid non-namespaced identifier (lowercase letters, numbers and dashes/underscores only)');
    } else if (stateNameField.value in $dialogueData.states && stateNameField.value !== currentName) {
      stateNameField.setCustomValidity('A state with that name already exists');
    } else {
      stateNameField.setCustomValidity('');
      stateNameField.reportValidity();
      return true;
    }
    stateNameField.reportValidity();
    return false;
  }

  function save() {
    if (currentName && validateNewName()) {
      $dialogueData = $dialogueData.withRenamedState(currentName, newName)
      if (currentlySelected) {
        selectState(newName);
      }
    }
  }

  async function tryDelete() {
    if (currentName && await deleteState(currentName)) {
      dialog.close();
    }
  }
</script>

<dialog bind:this={dialog}>
  {#if currentName}
  <form class="dialog-form" method="dialog" on:submit={save}>
    <label for="edit_state_name">Pick a new internal ID for this dialogue state:</label>
    <input
      id="new_dialogue_state_name"
      class="name-input"
      pattern="[a-z0-9_\-]+"
      type="text"
      placeholder="first_steps, goodbyes, ..."
      bind:this={stateNameField}
      bind:value={newName}
      on:input={validateNewName}
    />
    <input id="new_state_name_submit" type="submit" class="btn btn-info btn-sm rename" value="Rename">
    <button type="button" class="delete btn btn-danger btn-sm" on:click={tryDelete}>Delete</button>
    <button type="button" class="cancel btn btn-warning btn-sm" on:click={() => dialog.close()}>Cancel</button>
  </form>
  {/if}
</dialog>
<style>
  form:invalid .rename {
    cursor: not-allowed;
    background-color: color-mix(in srgb, var(--color-invalid) 65%, transparent);
  }

  .cancel {
    margin-top: 1.5em;
  }

  .delete {
    margin-top: -0.75em;
  }
</style>
