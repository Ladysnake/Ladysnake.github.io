<script lang="ts">

  import {dialogueData} from "../dialogueDataStore";
  import type BlabberDialogue from "../model/BlabberDialogue";

  let log = '';

  function validateNewState(element: HTMLInputElement, dialogue: BlabberDialogue, acceptEmpty: boolean) {
    if (!(acceptEmpty || element.value)) {
      element.setCustomValidity('Please enter a valid non-namespaced identifier');
    } else if (element.validity.patternMismatch) {
      element.setCustomValidity('Must be a valid non-namespaced identifier (lowercase letters, numbers and dashes/underscores only)');
    } else if (element.value in dialogue.states) {
      element.setCustomValidity('A state with that name already exists');
    } else {
      element.setCustomValidity('');
      element.reportValidity();
      return true;
    }
    element.reportValidity();
    return false;
  }

  function submit() {
    const stateNameField = document.getElementById('new_dialogue_state_name') as HTMLInputElement;

    if (validateNewState(stateNameField, $dialogueData, false)) {
      log = '';
      const newState = stateNameField.value;
      $dialogueData = $dialogueData.withAddedState(newState);
      stateNameField.value = '';
    }
  }
</script>
<form id="new_dialogue_state" on:submit|preventDefault={submit}>
  <label for="new_dialogue_state_name">Pick an internal ID for a new dialogue state:</label>
  <input
    id="new_dialogue_state_name"
    class="name-input"
    pattern="[a-z0-9_\-]+"
    type="text"
    placeholder="first_steps, goodbyes, ..."
    on:input={(e) => validateNewState(e.currentTarget, $dialogueData, true)}
  />
  <input id="new_dialogue_state_submit" type="submit" class="btn btn-success btn-sm" value="New State">
  <p id="new_dialogue_state_log">{log}</p>
</form>
<style>
  form {
    display: flex;
    flex-direction: column;
    width: 95%;
    padding-top: 2rem;
    border-top: 2px solid var(--button-hover-outline);
  }

  label {
    white-space: normal;
  }

  .name-input {
    border: none;
    display: block;
    height: 45px;
    background-color: var(--button-background);
    text-align: left;
    margin-bottom: 2px;
    padding-left: 1rem;
  }
</style>
