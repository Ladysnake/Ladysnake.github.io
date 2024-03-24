<script lang="ts">
  import {getStateData, getStateKey} from "./DialogueStateView.svelte";
  import EditableTable from "../../../../lib/EditableTable.svelte";
  import {derived, type Writable} from "svelte/store";
  import type {DialogueChoice} from "../../BlabberDialogue";
  import McTextInput from "../../../../lib/McTextInput.svelte";
  import {dialogueStateKeys, dialogueTextFormat} from "../../dialogueDataStore";
  import {type McText, McTextType} from "../../../../lib/McText";

  const stateData = getStateData();
  const stateKey = getStateKey();
  const stateChoices: Writable<DialogueChoice[]> = {
    ...derived(stateData, (state) => state?.choices ?? []),
    set: (choices: DialogueChoice[]) => stateData.update((oldState) => ({
      ...oldState,
      choices,
    })),
    update: (fn: (oldChoices: DialogueChoice[]) => DialogueChoice[]) => stateData.update((oldState) => ({
      ...oldState,
      choices: fn(oldState.choices ?? []),
    })),
  };

  function appendChoice() {
    $stateData = {
      ...$stateData,
      choices: [
        ...($stateData.choices ?? []),
        {}
      ]
    }
  }

  function updateText(index: number, text: McText) {
    $stateChoices = [
      ...$stateChoices.slice(0, index),
      { ...($stateChoices[index]), text },
      ...$stateChoices.slice(index + 1),
    ];
  }

  function updateNext(index: number, next: string) {
    $stateChoices = [
      ...$stateChoices.slice(0, index),
      { ...($stateChoices[index]), next },
      ...$stateChoices.slice(index + 1),
    ];
  }

  function suggestTranslationKey(index: number) {
    switch ($dialogueTextFormat) {
      case McTextType.PLAIN:
        return 'Thank you, ...';
      case McTextType.TRANSLATION_KEY:
        return `mymod:dialogue.my_dialogue.${$stateKey}.choice_${index}.text`;
      case McTextType.JSON:
        return '{...}';
    }
  }
</script>

<div>
  <h3>
    Available Choices
    <span>
        <button type="button" class="btn btn-success btn-rounded" on:click={appendChoice}>
          New choice
        </button>
      </span>
  </h3>
  <div class="card-body">
    <EditableTable items={stateChoices} let:item let:index>
      <td class="input-cell">
        <McTextInput
          value={item.text}
          textFormat={$dialogueTextFormat}
          placeholder={suggestTranslationKey(index)}
          on:change={(e) => updateText(index, e.detail)}/>
      </td>
      <td class="input-cell"><select class="dialogue-choice-next-input" on:change={(e) => updateNext(index, e.currentTarget.value)}>
        {#each $dialogueStateKeys as state}
          <option value={state} selected={state === item.next}>{state}</option>
        {/each}
      </select></td>
    </EditableTable>
  </div>
</div>
