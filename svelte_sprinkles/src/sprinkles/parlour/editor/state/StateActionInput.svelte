<script context="module" lang="ts">
  interface ValueConstraint {
    placeholder: string;
    pattern: RegExp;
    errorMessage?: string;
  }

  const actionTypeMetadata: Record<string, ValueConstraint> = {
    'blabber:command': {
      pattern: /.+/,
      placeholder: '“say hi”, or “/effect give @s strength”, etc.',
    },
    'requiem:remnant_choice': {
      pattern: /[a-z0-9_\-]+:[a-z0-9_\/\-]+/,
      placeholder: 'requiem:remnant, ratsmischief:ratified, ...',
      errorMessage: 'Must be a valid namespaced identifier (modid:name)',
    }
  }
</script>
<script lang="ts">
  import type {DialogueAction} from "../../BlabberDialogue";
  import {getStateData} from "./DialogueStateView.svelte";

  const stateData = getStateData();

  $: type = $stateData.action?.type ?? '';
  $: value = $stateData.action?.value ?? '';
  $: typeMetadata = actionTypeMetadata[type];

  function updateAction(newValue: Partial<DialogueAction>) {
    $stateData = {
      ...$stateData,
      action: {
        ...($stateData.action ?? {}),
        ...newValue,
      }
    }
  }

  function onTypeChange(event: Event & { currentTarget: HTMLSelectElement }) {
    updateAction({
      type: event.currentTarget.value,
    });
  }

  function onValueChange(event: Event & { currentTarget: HTMLInputElement }) {
    updateAction({
      value: event.currentTarget.value,
    });
  }

  function onValueInput(event: Event & { currentTarget: HTMLInputElement }) {
    const actionValueField = event.currentTarget;
    if (actionValueField.validity.patternMismatch && typeMetadata?.errorMessage) {
      actionValueField.setCustomValidity(typeMetadata?.errorMessage);
      actionValueField.reportValidity();
    } else {
      actionValueField.setCustomValidity('');
    }
  }
</script>

<label for="dialogue-state-action">Action</label>
<fieldset id="dialogue-state-action">
  <select
    autocomplete="off"
    id="dialogue-state-action-type"
    bind:value={type}
    on:change={onTypeChange}
  >
    <option selected value="">
      No Action
    </option>
    <option value="blabber:command">
      Command
    </option>
    <option value="requiem:remnant_choice">
      [Requiem] Remnant Choice
    </option>
  </select>
  <input
    type="text"
    id="dialogue-state-action-value"
    disabled={!typeMetadata}
    placeholder={typeMetadata?.placeholder}
    pattern={typeMetadata?.pattern?.source}
    value={value}
    on:change={onValueChange}
    on:input={onValueInput}
  />
</fieldset>

<style>
  fieldset {
    display: flex;
  }

  #dialogue-state-action-value {
    flex-grow: 2;

    &:disabled {
      border-color: transparent;
      color: transparent;
    }
  }
</style>
