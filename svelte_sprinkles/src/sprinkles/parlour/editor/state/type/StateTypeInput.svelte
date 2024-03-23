<script lang="ts">
import ConfirmDialogueLayout from "./ConfirmDialogueLayout.svelte";
import EndDialogueLayout from "./EndDialogueLayout.svelte";
import DefaultDialogueLayout from "./DefaultDialogueLayout.svelte";
import {dialogueData} from "../../../dialogueDataStore";

export let state: string;

$: value = $dialogueData.states[state]?.type ?? 'default';

function onChange(event: Event & { currentTarget: HTMLInputElement }) {
  $dialogueData = $dialogueData.withUpdatedState(state, (oldState) => ({
    ...oldState,
    type: event.currentTarget.value
  }));
  $dialogueData.saveToWindow();
}
</script>

<fieldset>
  <legend>Type</legend>
  <input
    type="radio"
    autocomplete="off"
    class="layout-selection"
    value="default"
    id="dialogue-state-default-type"
    name="dialogue-state-type"
    bind:group={value}
    on:change={onChange}
  >
  <label for="dialogue-state-default-type">
    <span>Default</span>
    <DefaultDialogueLayout/>
  </label>
  <input
    type="radio"
    autocomplete="off"
    class="layout-selection"
    value="ask_confirmation"
    id="dialogue-state-confirm-type"
    name="dialogue-state-type"
    bind:group={value}
    on:change={onChange}
  >
  <label for="dialogue-state-confirm-type">
    <span>Confirm</span>
    <ConfirmDialogueLayout/>
  </label>
  <input
    type="radio"
    autocomplete="off"
    class="layout-selection"
    value="end_dialogue"
    id="dialogue-state-ending-type"
    name="dialogue-state-type"
    bind:group={value}
    on:change={onChange}
  >
  <label for="dialogue-state-ending-type">
    <span>Ending</span>
    <EndDialogueLayout/>
  </label>
</fieldset>

<style>
  fieldset {
    grid-column-end: span 2;
  }

  .layout-selection {
    opacity: 0;
    width: 0;

    & + label {
      display: inline-flex;
      flex-direction: column;
      max-width: 30%;
      margin-right: 1rem;
      margin-left: 0.5rem;
      border: 2px solid var(--button-outline);
      background-color: var(--base-background-color);

      & span {
        text-align: center;
        border-bottom: 2px solid var(--button-outline);
        background-color: var(--button-background);
      }
    }

    &:checked + label {
      border-color: var(--button-selected-outline);

      & span {
        border-color: var(--button-selected-outline);
        background-color: var(--button-selected-outline);
      }
    }
  }
</style>
