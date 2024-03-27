<script lang="ts">
  import {getStateData, getStateKey} from "./DialogueStateView.svelte";
  import EditableTable from "../../../../lib/EditableTable.svelte";
  import {derived, type Writable} from "svelte/store";
  import {choiceIdKey, type DialogueChoice, genChoiceId} from "../../BlabberDialogue";
  import McTextInput from "../../../../lib/McTextInput.svelte";
  import {dialogueStateKeys, dialogueTextFormat} from "../../dialogueDataStore";
  import {type McText, McTextType} from "../../../../lib/McText";
  import './dialogue-state-choices.css';
  import {afterUpdate} from "svelte";

  const stateData = getStateData();
  const stateKey = getStateKey();
  const stateChoices: Writable<DialogueChoice[]> = {
    ...derived(stateData, (state) => state?.choices ?? [{[choiceIdKey]: genChoiceId()}]),
    set: (choices: DialogueChoice[]) => stateData.update((oldState) => ({
      ...oldState,
      choices,
    })),
    update: (fn: (oldChoices: DialogueChoice[]) => DialogueChoice[]) => stateData.update((oldState) => ({
      ...oldState,
      choices: fn(oldState.choices ?? []),
    })),
  };

  let newChoiceId: number | null;

  function appendChoice() {
    newChoiceId = genChoiceId();
    $stateData = {
      ...$stateData,
      choices: [
        ...($stateData.choices ?? []),
        {
          [choiceIdKey]: newChoiceId,
          next: $dialogueStateKeys[0],
        }
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

  afterUpdate(() => {
    newChoiceId = null;
  });

  function focusNewChoice(node: HTMLElement, choice: DialogueChoice) {
    if (choice[choiceIdKey] === newChoiceId) {
      node.scrollIntoView();
      node.focus();
    }
  }
</script>

<div class="dialogue-choice-editor">
  <h3>
    Available Choices
    <span>
        <button type="button" class="btn btn-success btn-rounded" on:click={appendChoice}>
          New choice
        </button>
      </span>
  </h3>
  <div class="table-container">
    <EditableTable items={stateChoices} keyExtractor={(c) => c[choiceIdKey]}>
      <svelte:fragment slot="head">
        <th class="col-text">Text</th>
        <th class="col-next">Next State</th>
      </svelte:fragment>
      <svelte:fragment slot="row" let:item let:index>
        <td class="col-text input-cell">
          <McTextInput
            value={item.text}
            textFormat={$dialogueTextFormat}
            placeholder={suggestTranslationKey(index)}
            action={(node) => focusNewChoice(node, item)}
            on:change={(e) => updateText(index, e.detail)}
          />
        </td>
        <td class="col-next input-cell"><select class="dialogue-choice-next-input" on:change={(e) => updateNext(index, e.currentTarget.value)}>
          {#each $dialogueStateKeys as state}
            <option value={state} selected={state === item.next}>{state}</option>
          {/each}
        </select></td>
      </svelte:fragment>
    </EditableTable>
  </div>
</div>

<style>
  .table-container {
    width: 90%;
    margin: auto;
  }
</style>
