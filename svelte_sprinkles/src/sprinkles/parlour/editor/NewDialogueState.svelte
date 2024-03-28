<script lang="ts">

  import {validateIdentifierField} from "../validation";
  import {dialogueData} from "../dialogueDataStore";

  let log = '';

  function submit() {
    const stateNameField = document.getElementById('new_dialogue_state_name') as HTMLInputElement;

    if (validateIdentifierField(stateNameField)) {
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
    on:input={(e) => validateIdentifierField(e.currentTarget, $dialogueData, true)}
  />
  <input id="new_dialogue_state_submit" type="submit" class="btn btn-success btn-sm" value="New State">
  <p id="new_dialogue_state_log"></p>
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